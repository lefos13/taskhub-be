# Nest Template

## Description

This project is a robust, production-ready NestJS template that aims to provide a solid foundation for any back-end setup. It emphasizes clean architecture, sensible defaults, and developer experience. Out of the box you get:

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

## Available Endpoints

### Authentication

- `POST /auth/token` - Generate JWT token

### Protected Routes (Require JWT)

- `GET /protected/profile` - Get user profile from token
- `GET /protected/device-info` - Get device information

### Health & Monitoring

- `GET /health` - Comprehensive health check
- `GET /health/liveness` - Liveness probe
- `GET /health/readiness` - Readiness probe
- `GET /metrics` - Prometheus metrics

### Documentation

- `GET /api-docs` - Swagger UI (interactive API documentation)

---

Minimal, pragmatic, and ready to extend — use this as a starting point for any backend service.
