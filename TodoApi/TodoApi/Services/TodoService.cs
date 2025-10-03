using System.Linq.Expressions;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Services.Interfaces;

namespace TodoApi.Services;

public class TodoService(TodoDbContext context, ILogger<TodoService> logger) : ITodoService
{
    public async Task<IEnumerable<TodoResponse>> GetTodosAsync(string userId, TodoFilter? filter = null)
    {
        try
        {
            var query = context.TodoItems.AsQueryable();
            query = query.Where((Expression<Func<TodoItem, bool>>)(t => t.UserId == userId));

            if (filter != null)
            {
                if (filter.IsCompleted.HasValue)
                    query = query.Where(t => t.IsCompleted == filter.IsCompleted.Value);

                if (filter.Priority.HasValue)
                    query = query.Where(t => t.Priority == filter.Priority.Value);

                if (filter.DueBefore.HasValue)
                    query = query.Where(t => t.DueDate <= filter.DueBefore.Value);

                if (filter.CreatedAfter.HasValue)
                    query = query.Where(t => t.CreatedAt >= filter.CreatedAfter.Value);

                if (!string.IsNullOrEmpty(filter.Tags))
                    query = query.Where(t => t.Tags != null && t.Tags.Contains(filter.Tags));

                if (!filter.IncludeArchived)
                    query = query.Where(t => !t.IsArchived);
            }
            else
            {
                query = query.Where(t => !t.IsArchived);
            }

            var todos = await query
                .OrderByDescending(t => t.CreatedAt)
                .AsNoTracking()
                .ToListAsync();

            logger.LogInformation("Retrieved {Count} todos for user {UserId}", todos.Count, userId);

            return todos.Select(MapToTodoResponse).ToList();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving todos for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TodoResponse?> GetTodoAsync(int id, string userId)
    {
        try
        {
            var todo = await context.TodoItems
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo != null) return MapToTodoResponse(todo);
            logger.LogWarning("Todo {TodoId} not found for user {UserId}", id, userId);
            return null;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving todo {TodoId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<TodoResponse> CreateTodoAsync(CreateTodoRequest request, string userId)
    {
        try
        {
            var todo = new TodoItem
            {
                Title = request.Title,
                Description = request.Description,
                Priority = request.Priority,
                DueDate = request.DueDate,
                Tags = request.Tags != null ? JsonSerializer.Serialize(request.Tags) : null,
                UserId = userId
            };

            context.TodoItems.Add(todo);
            await context.SaveChangesAsync();

            var created = await context.TodoItems
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == todo.Id && t.UserId == userId);

            logger.LogInformation("Created todo {TodoId} for user {UserId}", todo.Id, userId);

            return MapToTodoResponse(created ?? todo);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error creating todo for user {UserId}", userId);
            throw;
        }
    }

    public async Task<TodoResponse?> UpdateTodoAsync(int id, UpdateTodoRequest request, string userId)
    {
        try
        {
            var todo = await context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null)
            {
                logger.LogWarning("Todo {TodoId} not found for update by user {UserId}", id, userId);
                return null;
            }

            var wasCompleted = todo.IsCompleted;

            todo.Title = request.Title;
            todo.Description = request.Description;
            todo.IsCompleted = request.IsCompleted;
            todo.Priority = request.Priority;
            todo.DueDate = request.DueDate;
            todo.Tags = request.Tags != null ? JsonSerializer.Serialize(request.Tags) : null;

            todo.CompletedAt = request.IsCompleted switch
            {
                true when !wasCompleted => DateTime.UtcNow,
                false when wasCompleted => null,
                _ => todo.CompletedAt
            };

            await context.SaveChangesAsync();

            var updated = await context.TodoItems
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            logger.LogInformation("Updated todo {TodoId} for user {UserId}", id, userId);

            return MapToTodoResponse(updated ?? todo);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating todo {TodoId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> DeleteTodoAsync(int id, string userId)
    {
        try
        {
            var todo = await context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null)
            {
                logger.LogWarning("Todo {TodoId} not found for deletion by user {UserId}", id, userId);
                return false;
            }

            context.TodoItems.Remove(todo);
            await context.SaveChangesAsync();

            logger.LogInformation("Deleted todo {TodoId} for user {UserId}", id, userId);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting todo {TodoId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> ArchiveTodoAsync(int id, string userId)
    {
        try
        {
            var todo = await context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null) return false;

            todo.IsArchived = true;
            todo.ArchivedAt = DateTime.UtcNow;

            await context.SaveChangesAsync();
            logger.LogInformation("Archived todo {TodoId} for user {UserId}", id, userId);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error archiving todo {TodoId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<bool> RestoreTodoAsync(int id, string userId)
    {
        try
        {
            var todo = await context.TodoItems
                .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if (todo == null) return false;

            todo.IsArchived = false;
            todo.ArchivedAt = null;

            await context.SaveChangesAsync();

            logger.LogInformation("Restored todo {TodoId} for user {UserId}", id, userId);

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error restoring todo {TodoId} for user {UserId}", id, userId);
            throw;
        }
    }

    public async Task<TodoStats> GetTodoStatsAsync(string userId)
    {
        try
        {
            var todos = await context.TodoItems
                .AsNoTracking()
                .Where(t => t.UserId == userId && !t.IsArchived)
                .ToListAsync();

            var stats = new TodoStats(
                todos.Count,
                todos.Count(t => t.IsCompleted),
                todos.Count(t => !t.IsCompleted),
                todos.Count(t => t.Priority >= Priority.High),
                todos.Count(t => t.DueDate.HasValue && t.DueDate < DateTime.UtcNow && !t.IsCompleted),
                todos.Count(t => t.CompletedAt?.Date == DateTime.UtcNow.Date)
            );

            return stats;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error retrieving todo stats for user {UserId}", userId);
            throw;
        }
    }

    private static TodoResponse MapToTodoResponse(TodoItem todo)
    {
        var tags = string.IsNullOrEmpty(todo.Tags)
            ? []
            : JsonSerializer.Deserialize<string[]>(todo.Tags) ?? [];

        return new TodoResponse(
            todo.Id,
            todo.Title,
            todo.Description,
            todo.IsCompleted,
            todo.CreatedAt,
            todo.CompletedAt,
            todo.UserId,
            todo.Priority,
            todo.DueDate,
            tags,
            todo.IsArchived,
            todo.ArchivedAt
        );
    }
}

public record TodoStats(
    int Total,
    int Completed,
    int Active,
    int HighPriority,
    int Overdue,
    int CompletedToday
);