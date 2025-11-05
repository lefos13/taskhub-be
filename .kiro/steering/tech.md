# TaskHub Backend - Technology Stack

## Framework & Runtime

- **NestJS 11** with TypeScript (strict mode enabled)
- **Node.js** runtime environment
- **Express.js** as the underlying HTTP server

## Database & ORM

- **PostgreSQL** as primary database
- **TypeORM** for object-relational mapping
- **Redis** for caching and session storage

## Authentication & Security

- **JWT (JSON Web Tokens)** with Passport.js for authentication
- **bcrypt** for password hashing
- **Helmet** for security headers
- **CORS** configuration for cross-origin requests
- **Rate limiting** with ThrottlerModule

## Validation & Documentation

- **class-validator** and **class-transformer** for DTO validation
- **Swagger/OpenAPI** for API documentation
- **Pino** for structured logging

## Testing

- **Jest** for unit and integration testing
- **Supertest** for E2E API testing
- Target: 80%+ test coverage

## Code Quality

- **ESLint** with TypeScript support
- **Prettier** for code formatting
- **Husky** for pre-commit hooks
- **lint-staged** for staged file processing

## Monitoring & Observability

- **Prometheus** metrics collection
- **Sentry** for error tracking
- **Health checks** with Terminus module

## Common Commands

### Development

```bash
# Start development server with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug

# Build for production
npm run build

# Start production server
npm run start:prod
```

### Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Code Quality

```bash
# Format code
npm run format

# Lint and fix issues
npm run lint

# Run all pre-commit checks
npm run prepare
```

## Environment Configuration

- Environment variables validated using class-validator
- Configuration service with type safety
- Separate configs for development, testing, and production
