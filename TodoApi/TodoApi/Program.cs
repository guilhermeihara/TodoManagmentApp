using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;
using TodoApi.Data;
using TodoApi.Extensions;
using TodoApi.Handlers;
using TodoApi.Models;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/todoapi-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog();

builder.Services.AddTodoDbContext(builder.Configuration);
builder.Services.AddTodoIdentity();
builder.Services.AddAuthentication(builder.Configuration);
builder.Services.AddAuthorization();
builder.Services.AddValidators();
builder.Services.AddServices();

const string corsPolicy = "AllowReactApp";
builder.Services.AddTodoCors(corsPolicy, ["http://localhost:3000"]);

builder.Services.AddTodoOpenTelemetry();
builder.Services.AddTodoSwagger();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
    var context = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    await context.Database.MigrateAsync();
    await DatabaseSeeder.SeedAdminUserAsync(userManager);
}

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Todo API v1"));

app.UseCors(corsPolicy);
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthorizationEndpoints();
app.MapTodoEndpoints();

app.MapGet("/health", () => Results.Ok(new
    {
        Status = "Healthy",
        Timestamp = DateTime.UtcNow,
        Version = "1.0.0"
    }))
    .WithName("HealthCheck")
    .WithTags("Health");

app.Run();