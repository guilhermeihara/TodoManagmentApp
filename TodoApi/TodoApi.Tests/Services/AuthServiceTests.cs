using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;
using Shouldly;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Tests.Services;

[TestFixture]
public class AuthServiceTests
{
    [SetUp]
    public void Setup()
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        _userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object,
            Mock.Of<IOptions<IdentityOptions>>(),
            Mock.Of<IPasswordHasher<ApplicationUser>>(),
            Array.Empty<IUserValidator<ApplicationUser>>(),
            Array.Empty<IPasswordValidator<ApplicationUser>>(),
            Mock.Of<ILookupNormalizer>(),
            Mock.Of<IdentityErrorDescriber>(),
            Mock.Of<IServiceProvider>(),
            Mock.Of<ILogger<UserManager<ApplicationUser>>>());

        var contextAccessorMock = new Mock<IHttpContextAccessor>();
        var claimsFactoryMock = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
        _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
            _userManagerMock.Object,
            contextAccessorMock.Object,
            claimsFactoryMock.Object,
            Mock.Of<IOptions<IdentityOptions>>(),
            Mock.Of<ILogger<SignInManager<ApplicationUser>>>(),
            Mock.Of<IAuthenticationSchemeProvider>(),
            Mock.Of<IUserConfirmation<ApplicationUser>>());

        _configurationMock = new Mock<IConfiguration>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        SetupConfiguration();

        _authService = new AuthService(_userManagerMock.Object, _signInManagerMock.Object,
            _configurationMock.Object, _loggerMock.Object);
    }

    private Mock<UserManager<ApplicationUser>> _userManagerMock = null!;
    private Mock<SignInManager<ApplicationUser>> _signInManagerMock = null!;
    private Mock<IConfiguration> _configurationMock = null!;
    private Mock<ILogger<AuthService>> _loggerMock = null!;
    private AuthService _authService = null!;

    private void SetupConfiguration()
    {
        _configurationMock.Setup(x => x["Jwt:Key"]).Returns("ThisIsAVeryLongSecretKeyForTestingPurposes123456789");
        _configurationMock.Setup(x => x["Jwt:Issuer"]).Returns("TestIssuer");
        _configurationMock.Setup(x => x["Jwt:Audience"]).Returns("TestAudience");
    }

    [Test]
    public async Task LoginAsync_WithValidCredentials_ShouldReturnAuthResponse()
    {
        var user = CreateTestUser();
        var request = new LoginRequest("test@example.com", "password123");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync(user);
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, request.Password, false))
            .ReturnsAsync(SignInResult.Success);
        _userManagerMock.Setup(x => x.UpdateAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _authService.LoginAsync(request);

        result.ShouldNotBeNull();
        result.Token.ShouldNotBeNullOrEmpty();
        result.RefreshToken.ShouldNotBeNullOrEmpty();
        result.User.Email.ShouldBe(user.Email);
        result.User.FirstName.ShouldBe(user.FirstName);
        result.User.LastName.ShouldBe(user.LastName);
    }

    [Test]
    public async Task LoginAsync_WithInactiveUser_ShouldReturnNull()
    {
        var user = CreateTestUser();
        user.IsActive = false;
        var request = new LoginRequest("test@example.com", "password123");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync(user);

        var result = await _authService.LoginAsync(request);

        result.ShouldBeNull();
    }

    [Test]
    public async Task LoginAsync_WithInvalidPassword_ShouldReturnNull()
    {
        var user = CreateTestUser();
        var request = new LoginRequest("test@example.com", "wrongpassword");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync(user);
        _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, request.Password, false))
            .ReturnsAsync(SignInResult.Failed);

        var result = await _authService.LoginAsync(request);

        result.ShouldBeNull();
    }

    [Test]
    public async Task LoginAsync_WithNonExistentUser_ShouldReturnNull()
    {
        var request = new LoginRequest("nonexistent@example.com", "password123");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _authService.LoginAsync(request);

        result.ShouldBeNull();
    }

    [Test]
    public async Task RegisterAsync_WithValidRequest_ShouldReturnAuthResponse()
    {
        var request = new RegisterRequest("test@example.com", "password123", "John", "Doe");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((ApplicationUser)null);
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), request.Password))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _authService.RegisterAsync(request);

        result.ShouldNotBeNull();
        result.Token.ShouldNotBeNullOrEmpty();
        result.RefreshToken.ShouldNotBeNullOrEmpty();
        result.User.Email.ShouldBe(request.Email);
        result.User.FirstName.ShouldBe(request.FirstName);
        result.User.LastName.ShouldBe(request.LastName);
    }

    [Test]
    public async Task RegisterAsync_WithExistingEmail_ShouldReturnNull()
    {
        var existingUser = CreateTestUser();
        var request = new RegisterRequest("test@example.com", "password123", "John", "Doe");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync(existingUser);

        var result = await _authService.RegisterAsync(request);

        result.ShouldBeNull();
    }

    [Test]
    public async Task RegisterAsync_WithFailedUserCreation_ShouldReturnNull()
    {
        var request = new RegisterRequest("test@example.com", "password123", "John", "Doe");

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((ApplicationUser?)null);
        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<ApplicationUser>(), request.Password))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Password too weak" }));

        var result = await _authService.RegisterAsync(request);

        result.ShouldBeNull();
    }

    [Test]
    public async Task GetUserProfileAsync_WithValidUserId_ShouldReturnUserDto()
    {
        var user = CreateTestUser();
        var userId = "user123";

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);

        var result = await _authService.GetUserProfileAsync(userId);

        result.ShouldNotBeNull();
        result.Email.ShouldBe(user.Email);
        result.FirstName.ShouldBe(user.FirstName);
        result.LastName.ShouldBe(user.LastName);
    }

    [Test]
    public async Task GetUserProfileAsync_WithInvalidUserId_ShouldReturnNull()
    {
        var userId = "invalid123";

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _authService.GetUserProfileAsync(userId);

        result.ShouldBeNull();
    }

    [Test]
    public async Task ChangePasswordAsync_WithValidRequest_ShouldReturnTrue()
    {
        var user = CreateTestUser();
        var userId = "user123";
        var request = new ChangePasswordRequest("oldPassword", "newPassword123");

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);
        _userManagerMock.Setup(x => x.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _authService.ChangePasswordAsync(userId, request);

        result.ShouldBeTrue();
    }

    [Test]
    public async Task ChangePasswordAsync_WithInvalidUser_ShouldReturnFalse()
    {
        var userId = "invalid123";
        var request = new ChangePasswordRequest("oldPassword", "newPassword123");

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _authService.ChangePasswordAsync(userId, request);

        result.ShouldBeFalse();
    }

    [Test]
    public async Task ChangePasswordAsync_WithFailedPasswordChange_ShouldReturnFalse()
    {
        var user = CreateTestUser();
        var userId = "user123";
        var request = new ChangePasswordRequest("wrongOldPassword", "newPassword123");

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);
        _userManagerMock.Setup(x => x.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Incorrect password" }));

        var result = await _authService.ChangePasswordAsync(userId, request);

        result.ShouldBeFalse();
    }

    [Test]
    public async Task UpdateProfileAsync_WithValidRequest_ShouldReturnTrue()
    {
        var user = CreateTestUser();
        var userId = "user123";
        var request = new UpdateProfileRequest("UpdatedFirst", "UpdatedLast");

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync(user);
        _userManagerMock.Setup(x => x.UpdateAsync(user))
            .ReturnsAsync(IdentityResult.Success);

        var result = await _authService.UpdateProfileAsync(userId, request);

        result.ShouldBeTrue();
        user.FirstName.ShouldBe(request.FirstName);
        user.LastName.ShouldBe(request.LastName);
    }

    [Test]
    public async Task UpdateProfileAsync_WithInvalidUser_ShouldReturnFalse()
    {
        var userId = "invalid123";
        var request = new UpdateProfileRequest("UpdatedFirst", "UpdatedLast");

        _userManagerMock.Setup(x => x.FindByIdAsync(userId))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await _authService.UpdateProfileAsync(userId, request);

        result.ShouldBeFalse();
    }

    private static ApplicationUser CreateTestUser()
    {
        return new ApplicationUser
        {
            Id = "user123",
            UserName = "test@example.com",
            Email = "test@example.com",
            FirstName = "John",
            LastName = "Doe",
            EmailConfirmed = true,
            IsActive = true,
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            LastLoginAt = DateTime.UtcNow.AddDays(-1)
        };
    }
}