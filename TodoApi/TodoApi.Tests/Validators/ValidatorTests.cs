using AutoFixture;
using NUnit.Framework;
using Shouldly;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Validators;

namespace TodoApi.Tests.Validators;

public class ValidatorTests
{
    private readonly Fixture _fixture = new();

    [Test]
    public void LoginRequestValidator_ShouldFail_ForInvalidEmail()
    {
        var validator = new LoginRequestValidator();
        var result = validator.Validate(new LoginRequest("not-an-email", "Secret1!"));
        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(LoginRequest.Email));
    }

    [Test]
    public void RegisterRequestValidator_ShouldFail_ForWeakPassword()
    {
        var validator = new RegisterRequestValidator();
        var request = new RegisterRequest("user@example.com", "weak", _fixture.Create<string>().Substring(0, 5),
            _fixture.Create<string>()[..5]);
        var result = validator.Validate(request);
        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(RegisterRequest.Password));
    }

    [Test]
    public void CreateTodoRequestValidator_ShouldFail_ForTooManyTags()
    {
        var validator = new CreateTodoRequestValidator();
        var tags = Enumerable.Range(1, 11).Select(i => $"tag{i}").ToList();
        var request = new CreateTodoRequest("Title", "Desc", Priority.Medium, null, tags);
        var result = validator.Validate(request);
        result.IsValid.ShouldBeFalse();
        result.Errors.ShouldContain(e => e.PropertyName == nameof(CreateTodoRequest.Tags));
    }

    [Test]
    public void UpdateProfileRequestValidator_ShouldPass_ForValidInput()
    {
        var validator = new UpdateProfileRequestValidator();
        var request = new UpdateProfileRequest("John", "Doe");
        var result = validator.Validate(request);
        result.IsValid.ShouldBeTrue();
    }
}