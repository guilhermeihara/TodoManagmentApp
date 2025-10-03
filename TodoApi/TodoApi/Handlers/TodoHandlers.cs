using System.Security.Claims;
using FluentValidation;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Services.Interfaces;

namespace TodoApi.Handlers;

public static class TodoHandlers
{
    public static void MapTodoEndpoints(this WebApplication app)
    {
        var todoGroup = app.MapGroup("/api/todos")
            .WithTags("Todos")
            .RequireAuthorization();

        todoGroup.MapGet(string.Empty, GetTodosAsync)
            .WithName("GetTodos");

        todoGroup.MapGet("/{id:int}", GetTodoByIdAsync)
            .WithName("GetTodo");

        todoGroup.MapPost(string.Empty, PostTodoAsync)
            .WithName("CreateTodo");

        todoGroup.MapPut("/{id:int}", PutTodoAsync)
            .WithName("UpdateTodo");

        todoGroup.MapDelete("/{id:int}", DeleteTodoHandler)
            .WithName("DeleteTodo");

        todoGroup.MapPost("/{id:int}/archive", ArchiveTodoAsync)
            .WithName("ArchiveTodo");

        todoGroup.MapPost("/{id:int}/restore", RestoreTodoAsync)
            .WithName("RestoreTodo");

        todoGroup.MapGet("/stats", GetTodoStatsAsync)
            .WithName("GetTodoStats");
    }

    private static async Task<IResult> GetTodoStatsAsync(ITodoService todoService, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var stats = await todoService.GetTodoStatsAsync(userId);
        return Results.Ok(stats);
    }

    private static async Task<IResult> RestoreTodoAsync(int id, ITodoService todoService, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var result = await todoService.RestoreTodoAsync(id, userId);
        return result ? Results.NoContent() : Results.NotFound();
    }

    private static async Task<IResult> ArchiveTodoAsync(int id, ITodoService todoService, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var result = await todoService.ArchiveTodoAsync(id, userId);
        return result ? Results.NoContent() : Results.NotFound();
    }

    private static async Task<IResult> DeleteTodoHandler(ITodoService todoService, int id, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var result = await todoService.DeleteTodoAsync(id, userId);
        return result ? Results.NoContent() : Results.NotFound();
    }

    private static async Task<IResult> PutTodoAsync(int id, UpdateTodoRequest request, ITodoService todoService,
        IValidator<UpdateTodoRequest> validator, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid) return Results.BadRequest(validationResult.Errors);

        var todo = await todoService.UpdateTodoAsync(id, request, userId);
        return todo != null ? Results.Ok(todo) : Results.NotFound();
    }

    private static async Task<IResult> PostTodoAsync(CreateTodoRequest request, ITodoService todoService,
        IValidator<CreateTodoRequest> validator, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid) return Results.BadRequest(validationResult.Errors);

        var todo = await todoService.CreateTodoAsync(request, userId);
        return Results.Created($"/api/todos/{todo.Id}", todo);
    }

    private static async Task<IResult> GetTodoByIdAsync(int id, ITodoService todoService, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var todo = await todoService.GetTodoAsync(id, userId);
        return todo != null ? Results.Ok(todo) : Results.NotFound();
    }

    private static async Task<IResult> GetTodosAsync(ITodoService todoService, ClaimsPrincipal user,
        bool? isCompleted = null,
        Priority? priority = null,
        DateTime? dueBefore = null,
        DateTime? createdAfter = null,
        string? tags = null,
        bool includeArchived = false)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Results.Unauthorized();

        var filter = new TodoFilter(
            isCompleted,
            priority,
            dueBefore,
            createdAfter,
            tags,
            includeArchived
        );

        var todos = await todoService.GetTodosAsync(userId, filter);
        return Results.Ok(todos);
    }
}