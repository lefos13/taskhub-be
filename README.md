# TaskHub Backend

## Project Description

**TaskHub** is a full-stack project management system designed to help Team Leaders and Project Managers organize tasks, manage teams, track workloads, and monitor deadlines. This repository contains the backend API built with NestJS.

### Project Scope

This backend provides a comprehensive REST API for:

- **Task Management**: Create, update, and track tasks with status, priority, deadlines, and manday estimates
- **Project Management**: Organize tasks into projects with status tracking and analytics
- **Team Management**: Assign team members to projects and tasks, track workloads
- **User Management**: Authentication, authorization, and user profiles with role-based access control (RBAC)
- **Time Tracking**: Log hours worked on tasks and calculate consumed mandays
- **Analytics**: Workload distribution, project progress, and team performance metrics
- **Real-time Notifications**: WebSocket-based notifications for deadline alerts and task updates
- **Reporting**: Generate project status reports and export to PDF/Excel

### Technology Stack

- **Framework**: NestJS 11 with TypeScript
- **Database**: PostgreSQL (with TypeORM or Prisma)
- **Cache**: Redis for performance optimization
- **Authentication**: JWT with Passport.js
- **Real-time**: Socket.io for WebSocket communication
- **Testing**: Jest for unit and integration tests
- **Documentation**: Swagger/OpenAPI

### Architecture Overview

The backend follows a modular NestJS architecture with:

- **9 Core Database Entities**: Users, Projects, Teams, Tasks, Assignments, Subtasks, Time_Tracking, Notifications, Comments
- **RESTful API**: CRUD endpoints with filtering, sorting, and pagination
- **Authentication & Authorization**: JWT-based auth with RBAC (admin, manager, member roles)
- **Caching Strategy**: Redis cache-aside pattern for read-heavy operations
- **Real-time Features**: WebSocket support for live updates and notifications

For detailed architecture and implementation plan, see `projectplan/plan.md`.

## Template Features

This project is built on a robust, production-ready NestJS template that provides:

- **Authentication**: JWT-based auth utilities and guard
- **Security**: Helmet, CORS, rate limiting, validated config
- **Observability**: Structured logging (Pino), health checks, Prometheus metrics, error tracking (Sentry)
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Code Quality**: Pre-configured linting and formatting with pre-commit hooks
- **API Testing**: REST Client + Postman collection
- **Validation**: Global validation pipes + DTOs, consistent error responses
- **Versioning**: URI-based API versioning
- **TypeScript**: Strict mode, Nest module structure, example endpoints

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and set JWT_SECRET (minimum 32 characters)

# Start development server
npm run start:dev

# Visit http://localhost:3000
# API Documentation: http://localhost:3000/api-docs
```

## Project setup

```bash
npm install
```

## Compile and run the project

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Run tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Code Quality

This project uses automated code quality checks:

```bash
# Format code
npm run format

# Lint code
npm run lint
```

### Pre-commit Hooks

Husky automatically runs linting and formatting before each commit:

- ESLint checks and fixes TypeScript/JavaScript files
- Prettier formats all code files
- Commits are blocked if there are unfixable errors

See `GIT_HOOKS_GUIDE.md` for more details.

## API Testing

### REST Client (VS Code)

Use the REST Client file `api-tests.http` to quickly exercise endpoints. Open the file and click "Send Request" above any request.

### Swagger UI

Open http://localhost:3000/api-docs for interactive API documentation and testing.

### Postman

See `POSTMAN_COLLECTION.md` for Postman import instructions.

## Configuration & Security

See `CONFIGURATION_SECURITY.md` for details on:

- Environment variable validation
- Security headers (Helmet)
- CORS configuration
- Rate limiting
- Global exception handling
- API versioning

## Observability & Monitoring

See `OBSERVABILITY.md` for comprehensive documentation on:

- **Structured Logging**: High-performance JSON logging with Pino
- **Health Checks**: Kubernetes-ready liveness and readiness probes
  - `GET /health` - Comprehensive health check
  - `GET /health/liveness` - Liveness probe
  - `GET /health/readiness` - Readiness probe
- **Metrics**: Prometheus-compatible metrics at `/metrics`
- **Error Reporting**: Sentry integration for production error tracking
- **API Documentation**: Swagger/OpenAPI at `/api-docs`

## Documentation

- **[JWT Authentication](JWT_AUTHENTICATION.md)** - JWT setup and usage guide
- **[Configuration & Security](CONFIGURATION_SECURITY.md)** - Security features and configuration
- **[Git Hooks](GIT_HOOKS_GUIDE.md)** - Pre-commit hooks guide
- **[Postman Collection](POSTMAN_COLLECTION.md)** - API testing with Postman
- **[Observability](OBSERVABILITY.md)** - Logging, monitoring, and health checks
- **[Development Guide](.github/copilot-instructions.md)** - Coding standards and best practices

## Project Documentation

### Planning & Development

- **[Project Plan](projectplan/plan.md)** - Comprehensive development plan with technology stack and roadmap
- **[Backend Priorities](projectplan/backend-priorities.md)** - Prioritized backend development tasks
- **[Implementation Checklist](projectplan/implementation-checklist.md)** - Track completed and pending features
- **[Cursor AI Prompts](.cursor/prompts.md)** - Prompt templates for AI-assisted development

### Current Implementation Status

**✅ Completed (Template Infrastructure):**

- NestJS project setup with TypeScript
- Environment configuration & validation
- Security middleware (Helmet, CORS, Rate Limiting)
- Logging infrastructure (Pino)
- Health checks and metrics
- Error tracking (Sentry)
- API documentation (Swagger)
- Code quality tools (ESLint, Prettier, Husky)
- Basic JWT utilities and guards

**🟡 In Progress / Partial:**

- Authentication system (structure exists, needs full implementation)
- JWT token management (needs refresh tokens & blacklisting)

**❌ Pending (Critical Path):**

- PostgreSQL database setup and configuration
- Database schema implementation (9 entities)
- Docker configuration
- Redis caching setup
- Complete authentication (registration, login, RBAC)
- REST API endpoints (Users, Projects, Tasks, Teams)
- WebSocket implementation
- Advanced features (deadline tracking, manday estimation, analytics)

See `projectplan/implementation-checklist.md` for detailed status.

## Available Endpoints

### Current Endpoints (Template)

#### Authentication

- `POST /auth/token` - Generate JWT token (demo endpoint)

#### Protected Routes (Require JWT)

- `GET /protected/profile` - Get user profile from token (demo)
- `GET /protected/device-info` - Get device information (demo)

#### Health & Monitoring

- `GET /health` - Comprehensive health check
- `GET /health/liveness` - Liveness probe
- `GET /health/readiness` - Readiness probe
- `GET /metrics` - Prometheus metrics

#### Documentation

- `GET /api-docs` - Swagger UI (interactive API documentation)

### Planned Endpoints (To Be Implemented)

See `projectplan/plan.md` for complete API specification. Core endpoints will include:

- **Users API**: `/users` (CRUD operations)
- **Projects API**: `/projects` (CRUD operations)
- **Tasks API**: `/tasks` (CRUD operations, status updates, assignments)
- **Teams API**: `/teams` (CRUD operations, member management)
- **Time Tracking API**: `/time-tracking` (log hours, track mandays)
- **Analytics API**: `/analytics` (workload distribution, project metrics)
- **Notifications API**: `/notifications` (real-time updates)
- **Reports API**: `/reports` (project status, team performance)

---

## Development Roadmap

The project follows a phased development approach outlined in `projectplan/plan.md`:

1. **Phase 1: Foundation** - Database setup, Docker configuration, schema implementation
2. **Phase 2: Core Backend** - Authentication, REST APIs, JWT management, Redis caching
3. **Phase 3: Advanced Features** - WebSocket, deadline tracking, manday estimation, analytics
4. **Phase 4: Testing & Deployment** - Unit tests, E2E tests, CI/CD, production deployment

**Estimated Timeline**: ~101 days (20 weeks) for full-stack implementation

For backend-specific priorities, see `projectplan/backend-priorities.md`.

---

**Note**: This is a backend-only repository. The frontend will be developed separately using Vue.js 3 or React 18 as specified in the project plan.
