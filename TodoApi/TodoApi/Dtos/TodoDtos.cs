using System.ComponentModel.DataAnnotations;
using TodoApi.Models;

namespace TodoApi.Dtos;

public record CreateTodoRequest(
    [Required] [StringLength(200)] string Title,
    [StringLength(1000)] string Description,
    Priority Priority = Priority.Medium,
    DateTime? DueDate = null,
    List<string>? Tags = null
);

public record UpdateTodoRequest(
    [Required] [StringLength(200)] string Title,
    [StringLength(1000)] string Description,
    bool IsCompleted,
    Priority Priority,
    DateTime? DueDate,
    List<string>? Tags = null
);

public record TodoResponse(
    int Id,
    string Title,
    string Description,
    bool IsCompleted,
    DateTime CreatedAt,
    DateTime? CompletedAt,
    string UserId,
    Priority Priority,
    DateTime? DueDate,
    string[] Tags,
    bool IsArchived,
    DateTime? ArchivedAt
);

public record TodoSummary(
    int Id,
    string Title,
    bool IsCompleted,
    Priority Priority,
    DateTime? DueDate
);

public record TodoFilter(
    bool? IsCompleted = null,
    Priority? Priority = null,
    DateTime? DueBefore = null,
    DateTime? CreatedAfter = null,
    string? Tags = null,
    bool IncludeArchived = false
);