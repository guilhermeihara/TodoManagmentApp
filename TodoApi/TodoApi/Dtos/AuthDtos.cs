using System.ComponentModel.DataAnnotations;

namespace TodoApi.Dtos;

public record LoginRequest(
    [Required] [EmailAddress] string Email,
    [Required] [MinLength(6)] string Password
);

public record RegisterRequest(
    [Required] [EmailAddress] string Email,
    [Required] [MinLength(6)] string Password,
    [Required] string FirstName,
    [Required] string LastName
);

public record AuthResponse(
    string Token,
    string RefreshToken,
    DateTime ExpiresAt,
    UserDto User
);

public record UserDto(
    string Id,
    string Email,
    string FirstName,
    string LastName,
    DateTime CreatedAt,
    DateTime? LastLoginAt
);

public record TokenRequest(
    [Required] string RefreshToken
);

public record ChangePasswordRequest(
    [Required] string CurrentPassword,
    [Required] [MinLength(6)] string NewPassword
);

public record UpdateProfileRequest(
    [Required] string FirstName,
    [Required] string LastName
);