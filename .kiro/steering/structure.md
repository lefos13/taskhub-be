# TaskHub Backend - Project Structure

## Root Directory Structure

```
├── src/                    # Source code
├── test/                   # E2E tests
├── projectplan/            # Project documentation and planning
├── postman/               # Postman collections for API testing
├── .cursor/               # Cursor AI configuration
├── .github/               # GitHub workflows and templates
├── .husky/                # Git hooks configuration
├── node_modules/          # Dependencies
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── nest-cli.json          # NestJS CLI configuration
├── eslint.config.mjs      # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## Source Code Organization (`src/`)

### NestJS Module Structure

Each feature follows the standard NestJS module pattern:

```
src/
├── main.ts                # Application entry point
├── app.module.ts          # Root application module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── [feature]/             # Feature modules
│   ├── [feature].module.ts       # Module definition
│   ├── [feature].service.ts      # Business logic
│   ├── [feature].controller.ts   # HTTP endpoints
│   ├── [feature].spec.ts         # Unit tests
│   ├── entities/                 # TypeORM entities
│   │   └── [entity].entity.ts
│   └── dto/                      # Data Transfer Objects
│       ├── create-[entity].dto.ts
│       ├── update-[entity].dto.ts
│       └── query-[entity].dto.ts
├── common/                # Shared utilities
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication/authorization guards
│   ├── interceptors/      # Request/response interceptors
│   ├── pipes/             # Validation pipes
│   └── decorators/        # Custom decorators
├── config/                # Configuration modules
├── database/              # Database configuration and migrations
└── utils/                 # Utility functions
```

## Current Modules

### Implemented

- **auth/** - Authentication module with JWT utilities
- **health/** - Health check endpoints
- **common/** - Shared filters, guards, and utilities
- **config/** - Environment configuration and validation
- **utils/** - JWT utilities and helper functions

### Planned (To Be Implemented)

- **users/** - User management and profiles
- **projects/** - Project CRUD operations
- **tasks/** - Task management and tracking
- **teams/** - Team management and assignments
- **time-tracking/** - Time logging and manday tracking
- **notifications/** - Real-time notifications
- **analytics/** - Workload and performance analytics
- **reports/** - Report generation and export

## File Naming Conventions

- **Modules**: `[feature].module.ts`
- **Services**: `[feature].service.ts`
- **Controllers**: `[feature].controller.ts`
- **Entities**: `[entity].entity.ts`
- **DTOs**: `create-[entity].dto.ts`, `update-[entity].dto.ts`
- **Tests**: `[feature].spec.ts` (unit), `[feature].e2e-spec.ts` (E2E)
- **Interfaces**: `[name].interface.ts`
- **Types**: `[name].type.ts`
- **Constants**: `[name].constants.ts`

## Import Organization

Group imports in this order with blank lines between groups:

1. NestJS core imports
2. Third-party library imports
3. Local application imports (relative paths)

## API Structure

- **Base URL**: `/v1/` (versioned endpoints)
- **Authentication**: `/v1/auth/`
- **Protected Routes**: Require JWT authentication
- **Documentation**: `/api-docs` (Swagger UI)
- **Health Checks**: `/health`, `/health/liveness`, `/health/readiness`
- **Metrics**: `/metrics` (Prometheus format)

## Configuration Files

- **Environment**: Validated through `src/config/environment.validation.ts`
- **Database**: TypeORM configuration in `src/database/`
- **Testing**: Jest configuration in `package.json` and `test/jest-e2e.json`
- **Docker**: `Dockerfile` and `docker-compose.yml` (to be created)

## Development Workflow

1. Create feature branch from `develop`
2. Implement module following NestJS patterns
3. Write unit tests (target 80%+ coverage)
4. Update Swagger documentation
5. Run linting and formatting
6. Create pull request to `develop`
7. Merge to `main` for production deployment
