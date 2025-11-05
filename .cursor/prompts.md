# Cursor AI Prompt Instructions

This document provides guidelines and example prompts for using Cursor AI effectively with this TaskHub backend project. Follow these instructions to get the best results when requesting code generation or modifications.

## Project Context

**Project Name:** TaskHub Backend  
**Technology Stack:**

- Framework: NestJS 11 with TypeScript
- Database: PostgreSQL (using TypeORM or Prisma)
- Cache: Redis
- Authentication: JWT with Passport.js
- Real-time: Socket.io
- Testing: Jest
- Documentation: Swagger/OpenAPI

**Project Purpose:** A full-stack project management system for Team Leaders and Project Managers to organize tasks, manage teams, track workloads, and monitor deadlines.

## How to Use These Prompts

1. **Copy the template** that matches your task
2. **Fill in the specific details** (entity names, fields, endpoints, etc.)
3. **Paste into Cursor AI** and refine as needed
4. **Reference the plan** at `projectplan/plan.md` for architecture decisions

## Prompt Templates

### Database Schema & Entities

#### Template: Create Database Entity

```
Create a TypeORM entity for [ENTITY_NAME] with the following requirements:
- Use UUID primary keys
- Include fields: [LIST_FIELDS]
- Add relationships: [RELATIONSHIPS]
- Include timestamps (created_at, updated_at)
- Add appropriate indexes for [INDEXED_FIELDS]
- Use enum types for [ENUM_FIELDS]
- Follow the database schema design in projectplan/plan.md

Reference the existing code structure in src/ for consistency.
```

#### Example: Create User Entity

```
Create a TypeORM entity for User with the following requirements:
- Use UUID primary keys
- Include fields: email (unique), password (hashed), firstName, lastName, role (enum: admin, manager, member)
- Add relationships: many-to-many with Teams through TeamMembers
- Include timestamps (created_at, updated_at)
- Add appropriate indexes for email and role
- Use enum types for role field
- Follow the database schema design in projectplan/plan.md

Reference the existing code structure in src/ for consistency.
```

### REST API Endpoints

#### Template: Create CRUD Module

```
Create a complete NestJS module for [MODULE_NAME] with:
1. Entity: [ENTITY_NAME] with fields [FIELDS]
2. DTOs: Create[Entity]Dto, Update[Entity]Dto, Query[Entity]Dto with validation
3. Service: [Entity]Service with CRUD methods, filtering, sorting, pagination
4. Controller: [Entity]Controller with REST endpoints:
   - POST /[resource] - Create
   - GET /[resource] - List with pagination, filtering, sorting
   - GET /[resource]/:id - Get by ID
   - PUT /[resource]/:id - Update
   - DELETE /[resource]/:id - Delete
5. Include proper error handling and Swagger documentation
6. Add authorization guards for protected routes
7. Follow NestJS best practices and existing code patterns
```

#### Example: Create Projects Module

```
Create a complete NestJS module for Projects with:
1. Entity: Project with fields: name, description, startDate, endDate, status (enum: active, completed, on_hold)
2. DTOs: CreateProjectDto, UpdateProjectDto, QueryProjectDto with validation
3. Service: ProjectsService with CRUD methods, filtering by status and date range, sorting, pagination
4. Controller: ProjectsController with REST endpoints:
   - POST /projects - Create project
   - GET /projects - List with pagination, filtering, sorting
   - GET /projects/:id - Get by ID
   - PUT /projects/:id - Update
   - DELETE /projects/:id - Delete
5. Include proper error handling and Swagger documentation
6. Add authorization guards for protected routes
7. Follow NestJS best practices and existing code patterns
```

### Authentication & Authorization

#### Template: Enhance Authentication

```
Enhance the authentication system to include:
1. User registration endpoint with email validation and password requirements
2. User login endpoint that validates credentials and returns JWT tokens
3. Password hashing using bcrypt with minimum 10 rounds
4. Refresh token mechanism for extended sessions
5. Token blacklisting using Redis for logout functionality
6. Role-based access control (RBAC) with guards for admin, manager, member roles
7. Rate limiting on authentication endpoints
8. Store tokens in httpOnly cookies to prevent XSS attacks

Use the existing JWT utilities in src/utils/jwt.utils.ts and auth module structure.
Follow the security best practices in projectplan/plan.md.
```

### Caching & Performance

#### Template: Implement Redis Caching

```
Implement Redis caching for [RESOURCE] with:
1. Install and configure @nestjs/redis or similar package
2. Create a cache service that implements cache-aside pattern
3. Cache [RESOURCE] data with TTL of [TTL_VALUE]
4. Invalidate cache on create, update, delete operations
5. Add cache health check
6. Handle cache misses gracefully

Reference the Redis caching strategy in projectplan/plan.md.
Ensure Redis connection is configured in docker-compose.yml.
```

#### Example: Cache User Profiles

```
Implement Redis caching for User profiles with:
1. Install and configure @nestjs/redis or similar package
2. Create a cache service that implements cache-aside pattern
3. Cache user profile data with TTL of 1 hour
4. Invalidate cache on user update operations
5. Add cache health check
6. Handle cache misses gracefully

Reference the Redis caching strategy in projectplan/plan.md.
Ensure Redis connection is configured in docker-compose.yml.
```

### Real-time Features

#### Template: WebSocket Implementation

```
Implement WebSocket functionality for [FEATURE] using Socket.io:
1. Set up Socket.io server in NestJS
2. Implement authentication for WebSocket connections using JWT
3. Create event handlers for [EVENT_TYPES]
4. Use Socket.io rooms to broadcast updates to relevant users only
5. Add real-time presence indicators
6. Implement exponential backoff for reconnection attempts
7. Add error handling and reconnection logic

Follow the WebSocket implementation guidelines in projectplan/plan.md.
```

#### Example: Real-time Task Updates

```
Implement WebSocket functionality for task updates using Socket.io:
1. Set up Socket.io server in NestJS
2. Implement authentication for WebSocket connections using JWT
3. Create event handlers for task.created, task.updated, task.deleted, task.assigned
4. Use Socket.io rooms to broadcast updates to project team members only
5. Add real-time presence indicators showing who's viewing a task
6. Implement exponential backoff for reconnection attempts
7. Add error handling and reconnection logic

Follow the WebSocket implementation guidelines in projectplan/plan.md.
```

### Testing

#### Template: Write Tests

```
Write comprehensive tests for [MODULE_NAME] module:
1. Unit tests for [ServiceName] (target 80%+ coverage)
2. Unit tests for [ControllerName]
3. Integration tests for API endpoints
4. Mock external dependencies (database, Redis, etc.)
5. Test error scenarios and edge cases
6. Use existing test patterns from test/ directory

Follow Jest best practices and maintain consistency with existing test files.
```

### Database Migrations

#### Template: Create Migration

```
Create a TypeORM migration for [DESCRIPTION]:
1. Create migration file: [TIMESTAMP]-[description].ts
2. Add table: [TABLE_NAME] with columns [COLUMNS]
3. Add foreign key constraints: [CONSTRAINTS]
4. Add indexes: [INDEXES]
5. Add enum types if needed: [ENUMS]
6. Include both up() and down() methods

Follow the database schema design in projectplan/plan.md.
Ensure migration is reversible.
```

### Docker & Infrastructure

#### Template: Docker Configuration

```
Create Docker configuration for [COMPONENT]:
1. Create Dockerfile with multi-stage builds
2. Optimize for production (minimal image size)
3. Configure environment variables
4. Add health checks
5. Update docker-compose.yml to include [COMPONENT]
6. Ensure proper networking between services

Reference docker-compose requirements in projectplan/plan.md.
```

## Best Practices for Prompts

### DO:

- ✅ Reference specific files when relevant: "Use the pattern from src/auth/auth.module.ts"
- ✅ Include architectural requirements: "Follow NestJS module structure"
- ✅ Specify validation needs: "Add class-validator decorators to DTOs"
- ✅ Request documentation: "Include Swagger decorators"
- ✅ Mention security: "Add authorization guards"
- ✅ Reference the plan: "Follow projectplan/plan.md"

### DON'T:

- ❌ Create files without checking existing structure
- ❌ Skip validation or error handling
- ❌ Ignore existing patterns in the codebase
- ❌ Forget to add Swagger documentation
- ❌ Skip authorization checks
- ❌ Create duplicate functionality

## Common Patterns Reference

### Module Structure

```
src/
  [module-name]/
    [module-name].module.ts
    [module-name].service.ts
    [module-name].controller.ts
    entities/
      [entity].entity.ts
    dto/
      create-[entity].dto.ts
      update-[entity].dto.ts
      query-[entity].dto.ts
    [module-name].spec.ts
```

### DTO Validation Example

```typescript
export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;
}
```

### Service Pattern

```typescript
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createDto: CreateProjectDto): Promise<Project> {
    // Implementation
  }
}
```

### Controller Pattern

```typescript
@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async create(@Body() createDto: CreateProjectDto) {
    // Implementation
  }
}
```

## Priority Reference

When implementing features, refer to `projectplan/backend-priorities.md` to understand:

- What should be implemented first (Priority 1: Foundation)
- What can be developed in parallel
- Dependencies between features

## Quick Reference Links

- **Project Plan:** `projectplan/plan.md`
- **Backend Priorities:** `projectplan/backend-priorities.md`
- **Implementation Checklist:** `projectplan/implementation-checklist.md`
- **Current README:** `README.md`
