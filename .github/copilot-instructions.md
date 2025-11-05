# NestJS Project - Copilot Instructions

This file provides context-aware instructions for GitHub Copilot when working on this NestJS project.

## Project Overview

This is a **production-ready NestJS** backend application built with TypeScript, following the modular architecture pattern. It serves as a comprehensive template with enterprise-grade features for building scalable APIs.

### Tech Stack

- **Framework**: NestJS v11+
- **Language**: TypeScript 5.7+
- **Package Manager**: npm
- **Testing**: Jest (unit tests) and Supertest (e2e tests)
- **Code Quality**: ESLint + Prettier with pre-commit hooks (Husky + lint-staged)
- **Authentication**: JWT with custom guards and decorators
- **Security**: Helmet, CORS, Rate Limiting (@nestjs/throttler)
- **Observability**: Pino logging, Health checks (@nestjs/terminus), Prometheus metrics, Sentry
- **API Documentation**: Swagger/OpenAPI (@nestjs/swagger)
- **Validation**: class-validator, class-transformer with global pipes

---

## Architecture Guidelines

### Project Structure

This project follows a feature-based modular architecture with the following structure:

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data Transfer Objects
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   ├── jwt-auth.guard.ts   # JWT authentication guard
│   ├── jwt.decorators.ts   # Custom decorators (@GetJwtPayload, @DeviceId)
│   ├── protected.controller.ts  # Example protected endpoints
│   └── auth.module.ts      # Auth module definition
├── common/                  # Shared utilities
│   └── filters/            # Global exception filters
│       └── all-exceptions.filter.ts  # Standardized error responses
├── config/                  # Configuration files
│   ├── environment.validation.ts  # Env var validation schema
│   └── sentry.config.ts    # Sentry error tracking setup
├── health/                  # Health check module
│   ├── health.controller.ts  # Health endpoints
│   └── health.module.ts    # Health module definition
├── utils/                   # Utility functions
│   ├── jwt.utils.ts        # JWT helper functions
│   └── jwt.utils.spec.ts   # Unit tests for JWT utils
├── app.module.ts           # Root module
├── app.controller.ts       # Root controller
├── app.service.ts          # Root service
└── main.ts                 # Application entry point
```

### Follow NestJS Best Practices

1. **Modular Structure**: Organize code by feature/domain modules
   - Each module should be self-contained with its own controllers, services, and DTOs
   - Use the Nest CLI to generate resources: `nest g resource <name>`
   - Place shared utilities in `common/` or `utils/` directories
   - Place configuration logic in `config/` directory

2. **Dependency Injection**: Always use constructor-based injection

   ```typescript
   constructor(private readonly someService: SomeService) {}
   ```

3. **Separation of Concerns**:
   - **Controllers**: Handle HTTP requests/responses only - keep them thin
   - **Services**: Contain business logic and data operations
   - **DTOs**: Define and validate data shapes using class-validator
   - **Guards**: Handle authentication and authorization (e.g., `JwtAuthGuard`)
   - **Filters**: Handle exceptions and error formatting (e.g., `AllExceptionsFilter`)
   - **Decorators**: Extract and transform request data (e.g., `@GetJwtPayload()`)
   - **Utils**: Pure functions for reusable logic (e.g., JWT operations)

---

## Coding Standards

### TypeScript

- Use **strict TypeScript** settings (already configured in `tsconfig.json`)
- Prefer `interface` for data shapes, `type` for unions/intersections
- Always specify return types for functions and methods
- Use `readonly` for properties that shouldn't change

### Naming Conventions

- **Files**: Use kebab-case (e.g., `users.controller.ts`, `create-user.dto.ts`)
- **Classes**: Use PascalCase (e.g., `UsersController`, `UsersService`)
- **Interfaces**: Use PascalCase without "I" prefix (e.g., `User`, not `IUser`)
- **Methods**: Use camelCase (e.g., `findAll()`, `createUser()`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)

### Decorators

Use NestJS decorators consistently:

- `@Controller()` - Define route prefix
- `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()` - HTTP methods
- `@Body()`, `@Param()`, `@Query()` - Extract request data
- `@Injectable()` - Mark as provider
- `@Module()` - Define module metadata

---

## Controllers

### Guidelines

- Keep controllers **thin** - delegate logic to services
- Use DTOs for request/response validation
- Use HTTP status codes appropriately
- Handle exceptions with built-in exception classes

### Example Pattern

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

---

## Services

### Guidelines

- Mark with `@Injectable()` decorator
- Contain all business logic
- Return promises for async operations
- Throw exceptions for error cases (NotFoundException, BadRequestException, etc.)

### Example Pattern

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = { id: this.generateId(), ...dto };
    this.users.push(user);
    return user;
  }
}
```

---

## DTOs (Data Transfer Objects)

### Guidelines

- Use `class-validator` decorators for validation
- Place DTOs in a `dto` subfolder within each module
- Use `PartialType` from `@nestjs/mapped-types` for update DTOs

### Example Pattern

```typescript
// create-user.dto.ts
import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

// update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

---

## Testing

### Unit Tests

- Use Jest's `describe` and `it` blocks
- Mock dependencies using `jest.spyOn()` or manual mocks
- Test both success and error cases
- Aim for high code coverage (>80%)

### Test Pattern

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John', email: 'john@example.com' };
      const result = await service.create(dto);
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('John');
    });
  });
});
```

### E2E Tests

- Place in `test/` folder
- Test complete request/response cycles
- Use `supertest` for HTTP assertions

---

## Error Handling

### Use Built-in Exceptions

```typescript
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';

// Example usage
if (!user) {
  throw new NotFoundException('User not found');
}

if (invalidData) {
  throw new BadRequestException('Invalid data provided');
}
```

---

## Module Organization

### Structure by Feature

```
src/
├── users/
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── users.controller.ts
│   ├── users.controller.spec.ts
│   ├── users.service.ts
│   ├── users.service.spec.ts
│   └── users.module.ts
├── products/
│   └── ...
└── app.module.ts
```

### Module Pattern

```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [], // Other modules this depends on
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export if other modules need it
})
export class UsersModule {}
```

---

## Code Generation

### Use Nest CLI

```bash
# Generate a complete resource (recommended)
nest g resource <name>

# Generate individual components
nest g module <name>
nest g controller <name>
nest g service <name>
```

When generating code with Copilot:

- Follow the same structure as generated by Nest CLI
- Include proper imports from `@nestjs/common`
- Add corresponding test files

---

## Documentation & Comments

### When to Comment

- Complex business logic that isn't self-explanatory
- Public API methods (consider using JSDoc)
- Workarounds or non-obvious solutions

### When NOT to Comment

- Self-explanatory code
- Repeating what the code already says

### JSDoc Example

```typescript
/**
 * Finds a user by their unique identifier
 * @param id - The user's unique ID
 * @returns The user object or throws NotFoundException
 * @throws {NotFoundException} When user is not found
 */
async findOne(id: string): Promise<User> {
  // ...
}
```

---

## Security & Configuration

### Environment Variables

This project uses `@nestjs/config` with validation:

```typescript
// src/config/environment.validation.ts
export class EnvironmentVariables {
  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string = 'development';

  @IsString()
  PORT: string = '3000';

  @IsString()
  @IsOptional()
  CORS_ORIGIN?: string = '*';
}
```

**Required Environment Variables** (`.env` file):

- `JWT_SECRET` - Must be at least 32 characters
- `JWT_EXPIRES_IN` - Token expiration (e.g., '1h', '7d')
- `NODE_ENV` - Environment mode (development/production/test)
- `PORT` - Server port (default: 3000)
- `CORS_ORIGIN` - Allowed CORS origins (default: \*)
- `SENTRY_DSN` - Sentry error tracking (optional, production only)
- `SENTRY_ENVIRONMENT` - Sentry environment label
- `SENTRY_TRACES_SAMPLE_RATE` - Sentry trace sampling rate

### Security Features

1. **Helmet**: Security headers configured in `main.ts`
2. **CORS**: Configurable via `CORS_ORIGIN` environment variable
3. **Rate Limiting**: Global throttler (10 requests per 60 seconds)
   - Override per endpoint: `@Throttle({ default: { limit: 5, ttl: 60000 } })`
   - Skip throttling: `@SkipThrottle()`
4. **Global Validation Pipe**: Automatic DTO validation with whitelist
5. **API Versioning**: URI-based versioning (default v1)
6. **Global Exception Filter**: Consistent error response format

### Global Exception Filter

All errors return a standardized format:

```typescript
interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
}
```

### Authentication

JWT-based authentication with:

- **JwtAuthGuard**: Apply to routes requiring authentication
- **Custom Decorators**:
  - `@GetJwtPayload()` - Extract full JWT payload
  - `@DeviceId()` - Extract device ID from JWT
- **Token Generation**: `POST /auth/token` endpoint
- **Protected Routes**: Use `@UseGuards(JwtAuthGuard)`

Example:

```typescript
@Controller('protected')
@UseGuards(JwtAuthGuard)
export class ProtectedController {
  @Get('profile')
  getProfile(@GetJwtPayload() payload: JwtPayload) {
    return { deviceId: payload.deviceId };
  }
}
```

---

## Observability & Monitoring

### Structured Logging (Pino)

Configured in `app.module.ts`:

- **Development**: Pretty-printed, colorized output
- **Production**: JSON format for log aggregation
- **Level**: debug (dev) / info (prod)

```typescript
// Use Logger in any service/controller
import { Logger } from '@nestjs/common';

export class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Info message');
    this.logger.debug('Debug message');
    this.logger.warn('Warning');
    this.logger.error('Error message', stackTrace);
  }
}
```

### Health Checks

Three health check endpoints (using @nestjs/terminus):

- `GET /health` - Comprehensive check (memory heap, RSS, disk)
- `GET /health/liveness` - Kubernetes liveness probe
- `GET /health/readiness` - Kubernetes readiness probe

**Note**: On Windows, disk checks use `C:\\` path. Adjust for your system if needed.

### Prometheus Metrics

Available at `GET /metrics`:

- Process CPU and memory metrics
- Node.js heap and GC metrics
- HTTP request metrics (when instrumented)

### Error Reporting (Sentry)

- Automatically initialized in `main.ts`
- Only enabled in production when `SENTRY_DSN` is set
- Captures unhandled exceptions

### API Documentation (Swagger)

Interactive API docs at `GET /api-docs`:

- JWT Bearer authentication support
- Request/response examples
- Organized by tags (auth, protected, health)

**Adding Swagger decorators:**

```typescript
@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    // ...
  }
}
```

---

## Configuration

### Environment Variables

- Use `@nestjs/config` for configuration management
- Store sensitive data in `.env` (never commit this)
- Provide `.env.example` template

---

## Git Workflow & Code Quality

### Pre-commit Hooks

This project uses **Husky** with **lint-staged**:

- Automatically runs before each commit
- Lints and formats TypeScript/JavaScript files
- Formats JSON and Markdown files
- Blocks commits if there are unfixable errors

Configuration in `package.json`:

```json
"lint-staged": {
  "*.{ts,js}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

### Available Scripts

```bash
# Development
npm run start:dev       # Watch mode with hot reload
npm run start:debug     # Debug mode

# Build & Production
npm run build          # TypeScript compilation
npm run start:prod     # Run production build

# Testing
npm run test           # Run unit tests
npm run test:watch     # Watch mode for tests
npm run test:cov       # Generate coverage report
npm run test:e2e       # Run end-to-end tests

# Code Quality
npm run lint           # Lint and auto-fix
npm run format         # Format all files with Prettier
```

### Git Workflow

- Write clear, concise commit messages
- Keep commits atomic (one logical change per commit)
- Pre-commit hooks will automatically lint and format
- Test before committing (hooks don't run tests automatically)

---

## Additional Resources

- See `DEVELOPMENT_GUIDE.md` for comprehensive development instructions
- See `README.md` for project setup and running instructions
- See `OBSERVABILITY.md` for logging, metrics, and monitoring
- See `CONFIGURATION_SECURITY.md` for security configuration
- See `JWT_AUTHENTICATION.md` for JWT implementation details
- See `POSTMAN_COLLECTION.md` for API testing with Postman
- Official docs: https://docs.nestjs.com

---

## API Testing

### REST Client Integration

This project uses the REST Client VS Code extension for API testing. The `api-tests.http` file contains all API endpoints.

**When creating a new API endpoint:**

1. Add the endpoint to `api-tests.http` immediately after implementation
2. Include examples for both success and error cases
3. Add comments explaining the endpoint's purpose
4. Group related endpoints together with clear section headers
5. Use variables for base URL and common headers
6. Provide example request bodies with realistic data

### API Test File Structure

```http
### Endpoint Description
POST {{baseUrl}}/path/to/endpoint
Content-Type: {{contentType}}

{
  "exampleField": "exampleValue"
}
```

### Testing Workflow

1. Start the development server: `npm run start:dev`
2. Open `api-tests.http`
3. Click "Send Request" above any request
4. Verify the response in the results panel
5. Use `@name` to chain requests and capture tokens

---

## Copilot-Specific Instructions

When generating code for this project:

1. Always follow the NestJS modular architecture
2. Use dependency injection via constructors
3. Include proper error handling with NestJS exceptions
4. Generate corresponding test files
5. Follow the established file naming conventions
6. Use async/await for asynchronous operations
7. Include proper TypeScript types
8. Follow the Prettier and ESLint configurations
9. **Add new endpoints to `api-tests.http` with examples**
10. **Include both success and failure test cases in the .http file**
11. **Add Swagger decorators** (`@ApiTags`, `@ApiOperation`, `@ApiResponse`) to all controllers
12. **Use `@SkipThrottle()` for endpoints that should bypass rate limiting** (e.g., health checks)
13. **Apply `@UseGuards(JwtAuthGuard)` to protected routes**
14. **Place shared utilities in appropriate directories** (`common/`, `utils/`, `config/`)
15. **Always validate environment variables** using class-validator in `config/environment.validation.ts`
