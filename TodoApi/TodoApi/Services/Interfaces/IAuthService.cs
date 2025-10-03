using TodoApi.Dtos;

namespace TodoApi.Services.Interfaces;

/// <summary>
///     Service interface for authentication operations.
/// </summary>
public interface IAuthService
{
    /// <summary>
    ///     Authenticates a user with the provided login request.
    /// </summary>
    /// <param name="request">The login request containing user credentials.</param>
    /// <returns>An <see cref="AuthResponse" /> if authentication is successful; otherwise, null.</returns>
    Task<AuthResponse?> LoginAsync(LoginRequest request);

    /// <summary>
    ///     Registers a new user with the provided registration request.
    /// </summary>
    /// <param name="request">The registration request containing user details.</param>
    /// <returns>An <see cref="AuthResponse" /> if registration is successful; otherwise, null.</returns>
    Task<AuthResponse?> RegisterAsync(RegisterRequest request);
}