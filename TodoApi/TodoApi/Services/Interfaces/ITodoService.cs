using TodoApi.Dtos;

namespace TodoApi.Services.Interfaces;

/// <summary>
///     Service interface for managing Todo items.
/// </summary>
public interface ITodoService
{
    /// <summary>
    ///     Retrieves a list of Todo items for a specific user, optionally filtered.
    /// </summary>
    /// <param name="userId">The user's identifier.</param>
    /// <param name="filter">Optional filter for the todos.</param>
    /// <returns>A collection of Todo responses.</returns>
    Task<IEnumerable<TodoResponse>> GetTodosAsync(string userId, TodoFilter? filter = null);

    /// <summary>
    ///     Retrieves a specific Todo item by its ID for a user.
    /// </summary>
    /// <param name="id">The Todo item's identifier.</param>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>The Todo response if found; otherwise, null.</returns>
    Task<TodoResponse?> GetTodoAsync(int id, string userId);

    /// <summary>
    ///     Creates a new Todo item for a user.
    /// </summary>
    /// <param name="request">The request containing Todo details.</param>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>The created Todo response.</returns>
    Task<TodoResponse> CreateTodoAsync(CreateTodoRequest request, string userId);

    /// <summary>
    ///     Updates an existing Todo item for a user.
    /// </summary>
    /// <param name="id">The Todo item's identifier.</param>
    /// <param name="request">The request containing updated Todo details.</param>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>The updated Todo response if found; otherwise, null.</returns>
    Task<TodoResponse?> UpdateTodoAsync(int id, UpdateTodoRequest request, string userId);

    /// <summary>
    ///     Deletes a Todo item for a user.
    /// </summary>
    /// <param name="id">The Todo item's identifier.</param>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>True if deleted; otherwise, false.</returns>
    Task<bool> DeleteTodoAsync(int id, string userId);

    /// <summary>
    ///     Archives a Todo item for a user.
    /// </summary>
    /// <param name="id">The Todo item's identifier.</param>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>True if archived; otherwise, false.</returns>
    Task<bool> ArchiveTodoAsync(int id, string userId);

    /// <summary>
    ///     Restores an archived Todo item for a user.
    /// </summary>
    /// <param name="id">The Todo item's identifier.</param>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>True if restored; otherwise, false.</returns>
    Task<bool> RestoreTodoAsync(int id, string userId);

    /// <summary>
    ///     Retrieves statistics about the user's Todo items.
    /// </summary>
    /// <param name="userId">The user's identifier.</param>
    /// <returns>The Todo statistics.</returns>
    Task<TodoStats> GetTodoStatsAsync(string userId);
}