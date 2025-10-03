# Todo Application

A full-stack todo management application built with a modern tech stack. This project consists of a React frontend and a .NET API backend, both containerized and orchestrated with Docker Compose for easy development and deployment.

## 🏗️ Project Architecture

```text
TodoManagmentApp/
├── todoapp/                    # React Frontend (TypeScript + MUI)
├── TodoApi/                    # .NET 9 Web API (C# + Entity Framework)
├── docker-compose.yml          # Container orchestration
└── README.md                   # This file
```

### Frontend (React + TypeScript)

- **Technology**: React 19, TypeScript, Material-UI, Vite
- **Features**: Modern UI, authentication, real-time updates, responsive design
- **Port**: 3000
- **Documentation**: [Frontend README](./todoapp/README.md)

### Backend (.NET Web API)

- **Technology**: .NET 9, ASP.NET Core, Entity Framework Core, SQLite
- **Features**: JWT authentication, RESTful API, comprehensive logging, health checks
- **Port**: 5001
- **Documentation**: [API README](./TodoApi/README.md)

## ✅ Features (Current)

- **Task CRUD**: create, read, update, complete, and delete todos
- **Due dates**: set & edit a due date per task
- **Tags**: add/remove tags and filter by them
- **Filtering & Sorting**: by status, due date, priority, and text
- **Responsive UI**: React + MUI, works across devices
- **Auth**: JWT-based login with token persisted on the client

## 🔭 Roadmap (Next Up)

- **AI assists**: summarize tasks, help write descriptions, and **break tasks into subtasks**
- **Attachments**: allow images/documents on tasks
- **Analytics**: monthly completed-tasks charts, average time-to-complete, per-tag/productivity insights
- **Subscriptions**: premium tier to unlock AI & analytics features

## 🚀 Quick Start with Docker Compose

The easiest way to run the entire application is using Docker Compose, which will build and start both services with proper networking and health checks.

### Prerequisites

- **Docker** and **Docker Compose** installed
- **Git** (to clone the repository)

### Running the Application

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TodoManagmentApp
   ```

2. **Start all services**

   ```bash
   docker-compose up -d
   ```

   This command will:
   - Build the .NET API container
   - Build the React frontend container
   - Start the API and wait for it to be healthy
   - Start the frontend (depends on API health check)
   - Create a shared network for service communication

3. **Access the application**
   - **Frontend**: <http://localhost:3000>
   - **API**: <http://localhost:5001>
   - **API Documentation**: <http://localhost:5001/swagger>
   - **Health Check**: <http://localhost:5001/health>

### Useful Docker Compose Commands

```bash
# Start services in foreground (see logs)
docker-compose up

# Rebuild containers without cache
docker-compose build --no-cache

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f todoapi
docker-compose logs -f todoapp

# Restart services
docker-compose restart

# Remove everything (containers, volumes, networks)
docker-compose down -v --remove-orphans
```

## 🔧 Development Setup

### Option 1: Full Docker Development (Recommended)

Use Docker Compose for the complete environment:

```bash
# Development with rebuild
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Watch logs during development
docker-compose logs -f
```

### Option 2: Hybrid Development

Run API in Docker and frontend locally for faster frontend development:

```bash
# Start only the API
docker-compose up todoapi -d

# In another terminal, run frontend locally
cd todoapp
npm install
npm run dev
```

### Option 3: Full Local Development

Run both services locally (requires .NET 9 SDK and Node.js):

```bash
# Terminal 1: Start API
cd TodoApi/TodoApi
dotnet run

# Terminal 2: Start Frontend
cd todoapp
npm install
npm run dev
```

## 🔌 Service Communication

The services are configured to communicate through Docker's internal networking:

- **Frontend** connects to API at `http://todoapi:8080` (internal) or `http://localhost:5001` (external)
- **API** serves on port `8080` inside container, exposed as `5001` on host
- **Frontend** serves on port `80` inside container, exposed as `3000` on host

## 🏥 Health Checks & Monitoring

### API Health Check

The API includes a health check endpoint that Docker Compose uses to ensure the service is ready:

- **Endpoint**: `/health`
- **Internal Check**: `curl -f http://localhost:8080/health`
- **External Access**: <http://localhost:5001/health>

The frontend container waits for the API to be healthy before starting.

### Logs & Monitoring

```bash
# View all logs
docker-compose logs -f

# View API logs only
docker-compose logs -f todoapi

# View frontend logs only
docker-compose logs -f todoapp

# View container status
docker-compose ps
```

## 🧱 Production Readiness & Scaling

- **Database**: SQLite is great for dev/single-node. For production, use a managed relational DB (e.g., **PostgreSQL/SQL Server** on **RDS**) to increase throughput and support concurrent users. Keep DB outside the API container; use migrations and regular backups.
- **Horizontal scaling**: run multiple API replicas behind a load balancer (e.g., ALB/NLB). Enable health checks and rolling deployments.
- **Static web hosting & CDN**: serve the UI from a CDN (e.g., **CloudFront**) with long-cache static assets and immutable build hashes for faster responses.
- **Observability**: centralize logs (e.g., CloudWatch/ELK), traces/metrics via OpenTelemetry; alerts on error rates and health.
- **Resilience**: readiness/liveness probes, circuit breakers/retries for outbound calls, and graceful shutdown.

## 🔐 Auth & Session Strategy

- **Current**: UI stores a JWT (24h expiry) and attaches it via interceptor.
- **Improve**: shorten access token TTL (e.g., **15 minutes**), add **refresh tokens with rotation**, enforce **revocation** on logout/compromise, and prefer **HTTP-only, Secure cookies** over localStorage for tokens.
- **Decouple auth**: today auth lives in the API; long term, move to a dedicated identity provider (**Amazon Cognito**, **Auth0**, **Azure AD B2C**) or a separate auth service so other services keep users logged in if the Todo API is down.

## 🗄️ Data Persistence

The API uses SQLite with Docker volume mounting for data persistence:

- **Database**: SQLite (`todos.db`)
- **Volume**: `todo-api:/app/data`
- **Persistence**: Data survives container restarts
- **Location**: Stored in Docker volume (managed by Docker)

### Database Management

```bash
# Backup database (while API is running)
docker-compose exec todoapi cp /app/data/todos.db /tmp/backup.db
docker cp todoapi:/tmp/backup.db ./todos-backup.db

# Reset database (remove volume)
docker-compose down -v
docker-compose up -d
```

## 🔐 Configuration

### Environment Variables

The Docker Compose setup includes production-ready configurations:

**API Configuration:**

- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=http://+:8080`
- `ConnectionStrings__DefaultConnection=Data Source=/app/data/todos.db`

**Frontend Configuration:**

- API base URL is automatically configured for the containerized environment

### Custom Configuration

To customize settings, modify `docker-compose.yml`:

```yaml
services:
  todoapi:
    environment:
      - ASPNETCORE_ENVIRONMENT=Development  # For dev mode
      - CustomSetting=value
```

## 🚀 Production Deployment

### Docker Compose Production

1. **Configure production settings**

   ```yaml
   # docker-compose.prod.yml
   services:
     todoapi:
       environment:
         - ASPNETCORE_ENVIRONMENT=Production
         - ConnectionStrings__DefaultConnection=your-production-db-string
   ```

2. **Deploy with production config**

   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Alternative Deployment Options

- **Container Registry**: Push images to Docker Hub, AWS ECR, etc.
- **Kubernetes**: Use the containers in a K8s cluster
- **Cloud Services**: Deploy to Azure Container Instances, AWS ECS, etc.

## 🛠️ Troubleshooting

### Common Issues

1. **Port conflicts**

   ```bash
   # Check what's using the ports
   lsof -i :3000
   lsof -i :5001
   
   # Kill processes if needed
   kill -9 $(lsof -ti:3000)
   kill -9 $(lsof -ti:5001)
   ```

2. **Container build failures**

   ```bash
   # Clean rebuild
   docker-compose down
   docker system prune -a
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **API not healthy**

   ```bash
   # Check API logs
   docker-compose logs todoapi
   
   # Check if API is responding
   curl http://localhost:5001/health
   ```

4. **Frontend can't connect to API**

   ```bash
   # Verify network connectivity
   docker-compose exec todoapp ping todoapi
   
   # Check if API is accessible from frontend
   docker-compose exec todoapp curl http://todoapi:8080/health
   ```

5. **Database issues**

   ```bash
   # Reset database
   docker-compose down -v
   docker-compose up -d
   ```

### Debug Mode

Run with debug logging:

```bash
# API debug logs
docker-compose exec todoapi tail -f /app/logs/todoapi-$(date +%Y%m%d).txt

# Frontend debug
docker-compose logs -f todoapp
```

## 📚 Documentation

- **[Frontend Documentation](./todoapp/README.md)** - React app setup, development, and deployment
- **[API Documentation](./TodoApi/README.md)** - .NET API development, endpoints, and configuration
- **[API Swagger Docs](http://localhost:5001/swagger)** - Interactive API documentation (when running)
