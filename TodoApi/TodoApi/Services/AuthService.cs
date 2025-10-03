using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Services.Interfaces;

namespace TodoApi.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IConfiguration configuration,
    ILogger<AuthService> logger)
    : IAuthService
{
    public async Task<AuthResponse?> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user is not { IsActive: true })
            {
                logger.LogWarning("Login attempt for non-existent or inactive user: {Email}", request.Email);
                return null;
            }

            var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed login attempt for user: {Email}", request.Email);
                return null;
            }

            user.LastLoginAt = DateTime.UtcNow;
            await userManager.UpdateAsync(user);

            var token = GenerateJwtTokenAsync(user);
            var refreshToken = GenerateRefreshToken();

            logger.LogInformation("User logged in successfully: {Email}", user.Email);

            return new AuthResponse(
                token,
                refreshToken,
                DateTime.UtcNow.AddHours(24),
                MapToUserDto(user)
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during login for user: {Email}", request.Email);
            return null;
        }
    }

    public async Task<AuthResponse?> RegisterAsync(RegisterRequest request)
    {
        try
        {
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                logger.LogWarning("Registration attempt with existing email: {Email}", request.Email);
                return null;
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                EmailConfirmed = true // For demo purposes
            };

            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                logger.LogWarning("Failed to create user: {Email}, Errors: {Errors}",
                    request.Email, string.Join(", ", result.Errors.Select(e => e.Description)));
                return null;
            }

            var token = GenerateJwtTokenAsync(user);
            var refreshToken = GenerateRefreshToken();

            logger.LogInformation("User registered successfully: {Email}", user.Email);

            return new AuthResponse(
                token,
                refreshToken,
                DateTime.UtcNow.AddHours(24),
                MapToUserDto(user)
            );
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during registration for user: {Email}", request.Email);
            return null;
        }
    }

    public async Task<UserDto?> GetUserProfileAsync(string userId)
    {
        var user = await userManager.FindByIdAsync(userId);
        return user != null ? MapToUserDto(user) : null;
    }

    public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return false;

        var result = await userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        return result.Succeeded;
    }

    public async Task<bool> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        var result = await userManager.UpdateAsync(user);
        return result.Succeeded;
    }

    private string GenerateJwtTokenAsync(ApplicationUser user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Name, user.UserName!),
            new(ClaimTypes.Email, user.Email!),
            new("firstName", user.FirstName),
            new("lastName", user.LastName)
        };

        var token = new JwtSecurityToken(
            configuration["Jwt:Issuer"],
            configuration["Jwt:Audience"],
            claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
    {
        return Guid.NewGuid().ToString();
    }

    private static UserDto MapToUserDto(ApplicationUser user)
    {
        return new UserDto(
            user.Id,
            user.Email!,
            user.FirstName,
            user.LastName,
            user.CreatedAt,
            user.LastLoginAt
        );
    }
}