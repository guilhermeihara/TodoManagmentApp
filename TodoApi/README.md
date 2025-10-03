# Todo API - .NET Backend

A robust and scalable Todo management REST API built with .NET 9, featuring JWT authentication, comprehensive logging, and modern software architecture patterns. This API serves as the backend for the Todo application, providing secure endpoints for user authentication and todo management.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login with token-based authentication
- **Todo Management**: Full CRUD operations for todo items with advanced features
- **User Management**: Built on ASP.NET Core Identity for robust user management
- **Priority System**: Support for Low, Medium, and High priority todos
- **Archive System**: Archive and restore functionality for completed todos
- **Statistics**: Get comprehensive statistics about user's todos
- **Validation**: Input validation using FluentValidation
- **Logging**: Comprehensive logging with Serilog (console and file output)
- **Monitoring**: OpenTelemetry integration for observability
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Health Checks**: Built-in health check endpoint
- **CORS Support**: Configured for frontend integration
- **Database Migrations**: Entity Framework Core with automatic migrations

## 🛠️ Tech Stack

### Core Framework

- **.NET 9** - Latest .NET version with modern C# features
- **ASP.NET Core** - High-performance web framework
- **ASP.NET Core Minimal APIs** - Lightweight endpoint mapping style for faster iteration
- **Entity Framework Core** - Object-relational mapping (ORM)
- **SQLite** - Lightweight database for development and production

### Authentication & Security

- **ASP.NET Core Identity** - Comprehensive identity management
- **JWT Bearer Authentication** - Secure token-based authentication
- **Authorization Policies** - Role and claim-based authorization

### Validation & Data

- **FluentValidation** - Fluent interface for building validation rules
- **Data Annotations** - Model validation attributes
- **Mappings** (via DTOs) - Object-to-object mapping

### Logging & Monitoring

- **Serilog** - Structured logging framework
  - Console sink for development
  - File sink for persistent logs (daily rolling)
- **OpenTelemetry** - Observability and distributed tracing
  - ASP.NET Core instrumentation
  - Entity Framework Core instrumentation
  - HTTP client instrumentation

### API Documentation

- **Swagger/OpenAPI** - Interactive API documentation
- **Swashbuckle.AspNetCore** - Swagger implementation for .NET

### Testing

- **NUnit** - Testing framework
- **Moq** - Mocking framework for unit tests
- **AutoFixture** - Test data generation
- **Shouldly** - Assertion framework
- **Microsoft.AspNetCore.Mvc.Testing** - Integration testing
- **Entity Framework InMemory** - In-memory database for testing

## 🧠 Design Decisions & Trade‑offs

- **Minimal APIs**: chosen for rapid delivery and minimal ceremony. Endpoints are composed via extension methods to keep files small and focused. *Trade‑off*: fewer out‑of‑the‑box layers (Controllers/Filters), so we enforce structure with endpoint modules and DI.
- **IdentityCore**: leverages ASP.NET Core **AddIdentityCore** for account creation, login, password hashing, lockout, etc. *Trade‑off*: adds schema and concepts, but saves significant time and provides battle‑tested building blocks.
- **SQLite**: default store for local/dev and simple deployments. *Trade‑off*: concurrency/locking limits compared to Postgres/SQL Server. EF Core migrations are supported, so swapping providers is straightforward.
- **DTOs + FluentValidation**: avoid over‑posting, keep contracts stable, and centralize validation. *Trade‑off*: more types to maintain, but clearer boundaries.

## 📋 Prerequisites

Before running the application, ensure you have:

- **.NET 9 SDK** or later
- **SQLite** (included with .NET)
- **Docker** (optional, for containerized deployment)

## 🏃‍♂️ Getting Started

### Option 1: Docker Setup

1. **Build the Docker image**

   ```bash
   # From the TodoApi/TodoApi directory
   docker build -t todo-api .
   ```

2. **Run the container**

   ```bash
   docker run -p 5001:8080 todo-api
   ```

3. **Access the API**
   - API Base URL: <http://localhost:5001>
   - Swagger Documentation: <http://localhost:5001/swagger>
   - Health Check: <http://localhost:5001/health>

### Option 2: Local Development

1. **Navigate to the API directory**

   ```bash
   cd TodoApi/TodoApi
   ```

2. **Restore dependencies**

   ```bash
   dotnet restore
   ```

3. **Run database migrations**

   ```bash
   dotnet ef database update
   ```

4. **Start the development server**

   ```bash
   dotnet run
   ```

5. **Access the API**
   - API Base URL: <http://localhost:5000> or <https://localhost:5001>
   - Swagger Documentation: <http://localhost:5001/swagger>

## 📜 Available Commands

### Development

- `dotnet run` - Start the development server
- `dotnet watch run` - Start with hot reload
- `dotnet build` - Build the project
- `dotnet clean` - Clean build artifacts

### Database

- `dotnet ef migrations add <MigrationName>` - Create a new migration
- `dotnet ef database update` - Apply migrations to database
- `dotnet ef migrations remove` - Remove the last migration
- `dotnet ef database drop` - Drop the database

### Test Commands

- `dotnet test` - Run all tests
- `dotnet test --collect:"XPlat Code Coverage"` - Run tests with coverage
- `dotnet test --logger trx` - Run tests with TRX output

### Publishing

- `dotnet publish -c Release` - Publish for production
- `dotnet publish -c Release -r linux-x64` - Publish for specific runtime

## 🔧 Configuration

### Database Configuration

The application uses SQLite by default. Update `appsettings.json` to change the database:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=todos.db"
  }
}
```

For other databases, install the appropriate Entity Framework provider and update the connection string.

### JWT Configuration

Configure JWT settings in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "your-super-secret-key-here",
    "Issuer": "TodoApi",
    "Audience": "TodoApp",
    "ExpirationHours": 24
  }
}
```

### CORS Configuration

CORS is configured to allow requests from the React frontend:

```csharp
builder.Services.AddTodoCors(corsPolicy, ["http://localhost:3000"]);
```

### Logging Configuration

Serilog is configured to write to both console and files:

```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/todoapi-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();
```

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Authenticate user | No |

### Todo Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/todos` | Get user's todos (with filtering) | Yes |
| GET | `/api/todos/{id}` | Get specific todo | Yes |
| POST | `/api/todos` | Create new todo | Yes |
| PUT | `/api/todos/{id}` | Update todo | Yes |
| DELETE | `/api/todos/{id}` | Delete todo | Yes |
| POST | `/api/todos/{id}/archive` | Archive todo | Yes |
| POST | `/api/todos/{id}/restore` | Restore archived todo | Yes |
| GET | `/api/todos/stats` | Get todo statistics | Yes |

### Health & Utility Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check endpoint | No |
| GET | `/swagger` | API documentation | No |

## 📊 Data Models

### TodoItem

```csharp
public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; }          // Max 200 chars
    public string Description { get; set; }    // Max 1000 chars
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string UserId { get; set; }
    public Priority Priority { get; set; }     // Low, Medium, High
    public DateTime? DueDate { get; set; }
    public string? Tags { get; set; }          // Max 500 chars
    public bool IsArchived { get; set; }
    public DateTime? ArchivedAt { get; set; }
}
```

### ApplicationUser

```csharp
public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; }
    public ICollection<TodoItem> TodoItems { get; set; }
}
```

## 🧪 Test Execution

### Running Tests

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test TodoApi.Tests/

# Run tests with verbose output
dotnet test --verbosity normal
```

### Test Structure

- **Unit Tests**: Test individual components in isolation
- **Validation Tests**: Test FluentValidation rules
- **Service Tests**: Test business logic services

### Testing Technologies

- **NUnit**: Primary testing framework
- **Moq**: Mocking dependencies
- **AutoFixture**: Generating test data
- **Shouldly**: Fluent assertions
- **In-Memory EF**: Database testing without persistence

## 🚀 Production Deployment

### Docker Deployment

The application includes a multi-stage Dockerfile for production:

```bash
# Build production image
docker build -t todo-api .

# Run production container
docker run -p 5001:8080 todo-api
```

### Manual Deployment

```bash
# Publish for production
dotnet publish -c Release -o ./publish

# Run the published application
cd publish
dotnet TodoApi.dll
```

### Environment Variables

For production deployment, configure these environment variables:

```bash
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
ConnectionStrings__DefaultConnection=your-production-connection-string
Jwt__Key=your-production-jwt-key
```

## 🔍 Monitoring & Observability

### Health Checks

The API includes a health check endpoint at `/health` that returns:

```json
{
  "Status": "Healthy",
  "Timestamp": "2025-10-03T10:00:00Z",
  "Version": "1.0.0"
}
```

### Logging

Logs are written to:

- **Console**: For development and container logs
- **Files**: `logs/todoapi-YYYYMMDD.txt` with daily rotation

### OpenTelemetry

The application is instrumented with OpenTelemetry for:

- HTTP request tracing
- Entity Framework query tracing
- Custom application metrics

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors**

   ```bash
   # Ensure database exists and migrations are applied
   dotnet ef database update
   ```

2. **JWT token errors**

   ```bash
   # Check JWT configuration in appsettings.json
   # Ensure the key is sufficiently long and secure
   ```

3. **CORS errors**

   ```bash
   # Verify the frontend URL is included in CORS policy
   # Check browser developer tools for specific CORS errors
   ```

4. **Port already in use**

   ```bash
   # Kill process using the port
   lsof -ti:5001 | xargs kill -9
   ```

### Debugging

- Enable detailed Entity Framework logging in `appsettings.Development.json`
- Use the `/swagger` endpoint to test API calls interactively
- Check log files in the `logs/` directory for detailed error information
