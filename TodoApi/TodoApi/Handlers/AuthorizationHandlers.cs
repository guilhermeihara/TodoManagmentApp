using FluentValidation;
using TodoApi.Dtos;
using TodoApi.Services.Interfaces;

namespace TodoApi.Handlers;

public static class AuthorizationHandlers
{
    public static void MapAuthorizationEndpoints(this WebApplication app)
    {
        var authGroup = app.MapGroup("/api/auth")
            .WithTags("Authentication");

        authGroup.MapPost("/login", LoginUserAsync)
            .WithName("Login");

        authGroup.MapPost("/register", RegisterUserAsync)
            .WithName("Register");
    }

    private static async Task<IResult> LoginUserAsync(LoginRequest request, IAuthService authService,
        IValidator<LoginRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid) return Results.BadRequest(validationResult.Errors);

        var result = await authService.LoginAsync(request);
        return result != null ? Results.Ok(result) : Results.Unauthorized();
    }

    private static async Task<IResult> RegisterUserAsync(RegisterRequest request, IAuthService authService,
        IValidator<RegisterRequest> validator)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid) return Results.BadRequest(validationResult.Errors);

        var result = await authService.RegisterAsync(request);
        return result != null ? Results.Ok(result) : Results.BadRequest("Registration failed");
    }
}