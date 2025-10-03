using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using Shouldly;
using TodoApi.Data;
using TodoApi.Dtos;
using TodoApi.Models;
using TodoApi.Services;

namespace TodoApi.Tests.Services;

[TestFixture]
public class TodoServiceTests
{
    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<TodoDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new TodoDbContext(options);
        _loggerMock = new Mock<ILogger<TodoService>>();
        _todoService = new TodoService(_context, _loggerMock.Object);
        _userId = "user123";
    }

    [TearDown]
    public void TearDown()
    {
        _context.Dispose();
    }

    private TodoDbContext _context = null!;
    private Mock<ILogger<TodoService>> _loggerMock = null!;
    private TodoService _todoService = null!;
    private string _userId = null!;

    [Test]
    public async Task GetTodosAsync_WithoutFilter_ShouldReturnAllActiveTodos()
    {
        var todos = CreateTestTodos();
        await _context.TodoItems.AddRangeAsync(todos);
        await _context.SaveChangesAsync();

        var result = await _todoService.GetTodosAsync(_userId);

        var todoList = result.ToList();
        todoList.Count.ShouldBe(2); // Only active todos
        todoList.ShouldAllBe(t => !t.IsArchived);
        todoList.ShouldAllBe(t => t.UserId == _userId);
    }

    [Test]
    public async Task GetTodosAsync_WithCompletedFilter_ShouldReturnOnlyCompletedTodos()
    {
        var todos = CreateTestTodos();
        await _context.TodoItems.AddRangeAsync(todos);
        await _context.SaveChangesAsync();

        var filter = new TodoFilter(true);
        var result = await _todoService.GetTodosAsync(_userId, filter);

        var todoList = result.ToList();
        todoList.Count.ShouldBe(1);
        todoList.ShouldAllBe(t => t.IsCompleted);
    }

    [Test]
    public async Task GetTodosAsync_WithPriorityFilter_ShouldReturnFilteredTodos()
    {
        var todos = CreateTestTodos();
        await _context.TodoItems.AddRangeAsync(todos);
        await _context.SaveChangesAsync();

        var filter = new TodoFilter(Priority: Priority.High);
        var result = await _todoService.GetTodosAsync(_userId, filter);

        var todoList = result.ToList();
        todoList.ShouldAllBe(t => t.Priority == Priority.High);
    }

    [Test]
    public async Task GetTodosAsync_WithIncludeArchived_ShouldReturnArchivedTodos()
    {
        var todos = CreateTestTodos();
        await _context.TodoItems.AddRangeAsync(todos);
        await _context.SaveChangesAsync();

        var filter = new TodoFilter(IncludeArchived: true);
        var result = await _todoService.GetTodosAsync(_userId, filter);

        var todoList = result.ToList();
        todoList.Count.ShouldBe(3); // All todos including archived
        todoList.ShouldContain(t => t.IsArchived);
    }

    [Test]
    public async Task GetTodoAsync_WithValidId_ShouldReturnTodo()
    {
        var todo = CreateTestTodo();
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _todoService.GetTodoAsync(todo.Id, _userId);

        result.ShouldNotBeNull();
        result.Id.ShouldBe(todo.Id);
        result.Title.ShouldBe(todo.Title);
        result.UserId.ShouldBe(_userId);
    }

    [Test]
    public async Task GetTodoAsync_WithInvalidId_ShouldReturnNull()
    {
        var result = await _todoService.GetTodoAsync(999, _userId);

        result.ShouldBeNull();
    }

    [Test]
    public async Task GetTodoAsync_WithWrongUser_ShouldReturnNull()
    {
        var todo = CreateTestTodo();
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _todoService.GetTodoAsync(todo.Id, "differentUser");

        result.ShouldBeNull();
    }

    [Test]
    public async Task CreateTodoAsync_WithValidRequest_ShouldCreateAndReturnTodo()
    {
        var request = new CreateTodoRequest(
            "New Todo",
            "Description",
            Priority.Medium,
            DateTime.UtcNow.AddDays(7),
            ["tag1", "tag2"]);

        var result = await _todoService.CreateTodoAsync(request, _userId);

        result.ShouldNotBeNull();
        result.Title.ShouldBe(request.Title);
        result.Description.ShouldBe(request.Description);
        result.Priority.ShouldBe(request.Priority);
        result.UserId.ShouldBe(_userId);
        result.Tags.ShouldBe(request.Tags?.ToArray());
        result.IsCompleted.ShouldBeFalse();
    }

    [Test]
    public async Task UpdateTodoAsync_WithValidRequest_ShouldUpdateAndReturnTodo()
    {
        var todo = CreateTestTodo();
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var request = new UpdateTodoRequest(
            "Updated Title",
            "Updated Description",
            true,
            Priority.High,
            DateTime.UtcNow.AddDays(3),
            ["updated"]);

        var result = await _todoService.UpdateTodoAsync(todo.Id, request, _userId);

        result.ShouldNotBeNull();
        result.Title.ShouldBe(request.Title);
        result.Description.ShouldBe(request.Description);
        result.IsCompleted.ShouldBe(request.IsCompleted);
        result.Priority.ShouldBe(request.Priority);
        result.CompletedAt.ShouldNotBeNull();
    }

    [Test]
    public async Task UpdateTodoAsync_MarkingAsIncomplete_ShouldClearCompletedAt()
    {
        var todo = CreateTestTodo();
        todo.IsCompleted = true;
        todo.CompletedAt = DateTime.UtcNow;
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var request = new UpdateTodoRequest(
            "Updated Title",
            "Updated Description",
            false,
            Priority.Medium,
            null,
            new List<string>());

        var result = await _todoService.UpdateTodoAsync(todo.Id, request, _userId);

        result.ShouldNotBeNull();
        result.IsCompleted.ShouldBeFalse();
        result.CompletedAt.ShouldBeNull();
    }

    [Test]
    public async Task UpdateTodoAsync_WithInvalidId_ShouldReturnNull()
    {
        var request = new UpdateTodoRequest("Title", "Description", false, Priority.Low, null, new List<string>());

        var result = await _todoService.UpdateTodoAsync(999, request, _userId);

        result.ShouldBeNull();
    }

    [Test]
    public async Task DeleteTodoAsync_WithValidId_ShouldReturnTrue()
    {
        var todo = CreateTestTodo();
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _todoService.DeleteTodoAsync(todo.Id, _userId);

        result.ShouldBeTrue();
        var deletedTodo = await _context.TodoItems.FindAsync(todo.Id);
        deletedTodo.ShouldBeNull();
    }

    [Test]
    public async Task DeleteTodoAsync_WithInvalidId_ShouldReturnFalse()
    {
        var result = await _todoService.DeleteTodoAsync(999, _userId);

        result.ShouldBeFalse();
    }

    [Test]
    public async Task ArchiveTodoAsync_WithValidId_ShouldReturnTrue()
    {
        var todo = CreateTestTodo();
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _todoService.ArchiveTodoAsync(todo.Id, _userId);

        result.ShouldBeTrue();
        var archivedTodo = await _context.TodoItems.FindAsync(todo.Id);
        archivedTodo.ShouldNotBeNull();
        archivedTodo.IsArchived.ShouldBeTrue();
        archivedTodo.ArchivedAt.ShouldNotBeNull();
    }

    [Test]
    public async Task ArchiveTodoAsync_WithInvalidId_ShouldReturnFalse()
    {
        var result = await _todoService.ArchiveTodoAsync(999, _userId);

        result.ShouldBeFalse();
    }

    [Test]
    public async Task RestoreTodoAsync_WithValidId_ShouldReturnTrue()
    {
        var todo = CreateTestTodo();
        todo.IsArchived = true;
        todo.ArchivedAt = DateTime.UtcNow;
        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        var result = await _todoService.RestoreTodoAsync(todo.Id, _userId);

        result.ShouldBeTrue();
        var restoredTodo = await _context.TodoItems.FindAsync(todo.Id);
        restoredTodo.ShouldNotBeNull();
        restoredTodo.IsArchived.ShouldBeFalse();
        restoredTodo.ArchivedAt.ShouldBeNull();
    }

    [Test]
    public async Task RestoreTodoAsync_WithInvalidId_ShouldReturnFalse()
    {
        var result = await _todoService.RestoreTodoAsync(999, _userId);

        result.ShouldBeFalse();
    }

    [Test]
    public async Task GetTodoStatsAsync_ShouldReturnCorrectStats()
    {
        var todos = CreateTestTodos();
        await _context.TodoItems.AddRangeAsync(todos);
        await _context.SaveChangesAsync();

        var result = await _todoService.GetTodoStatsAsync(_userId);

        result.Total.ShouldBe(2); // Only non-archived todos
        result.Completed.ShouldBe(1);
        result.Active.ShouldBe(1);
        result.HighPriority.ShouldBe(1);
        result.Overdue.ShouldBe(1); // One todo is overdue
        result.CompletedToday.ShouldBe(0); // None completed today
    }

    private TodoItem CreateTestTodo()
    {
        return new TodoItem
        {
            Title = "Test Todo",
            Description = "Test Description",
            UserId = _userId,
            Priority = Priority.Medium,
            DueDate = DateTime.UtcNow.AddDays(1),
            CreatedAt = DateTime.UtcNow.AddDays(-1)
        };
    }

    private List<TodoItem> CreateTestTodos()
    {
        return
        [
            new TodoItem
            {
                Title = "Active Todo",
                Description = "Active Description",
                UserId = _userId,
                Priority = Priority.Low,
                IsCompleted = false,
                DueDate = DateTime.UtcNow.AddDays(1),
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },

            new TodoItem
            {
                Title = "Completed Todo",
                Description = "Completed Description",
                UserId = _userId,
                Priority = Priority.High,
                IsCompleted = true,
                CompletedAt = DateTime.UtcNow.AddDays(-1),
                DueDate = DateTime.UtcNow.AddDays(-2), // Overdue when created
                CreatedAt = DateTime.UtcNow.AddDays(-3)
            },

            new TodoItem
            {
                Title = "Archived Todo",
                Description = "Archived Description",
                UserId = _userId,
                Priority = Priority.Medium,
                IsArchived = true,
                ArchivedAt = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-4)
            }
        ];
    }
}