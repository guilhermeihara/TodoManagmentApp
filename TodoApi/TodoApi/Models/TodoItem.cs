using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public sealed class TodoItem
{
    public int Id { get; set; }

    [Required] [StringLength(200)] public string Title { get; set; } = string.Empty;

    [StringLength(1000)] public string Description { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    [Required] public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;

    public Priority Priority { get; set; } = Priority.Medium;
    public DateTime? DueDate { get; set; }

    [StringLength(500)] public string? Tags { get; set; } = string.Empty;

    public bool IsArchived { get; set; }
    public DateTime? ArchivedAt { get; set; }
}

public enum Priority
{
    Low = 0,
    Medium = 1,
    High = 2
}