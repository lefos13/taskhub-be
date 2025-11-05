---
inclusion: always
---

# TaskHub Backend - Cursor AI Development Rules

## Project Overview

This is the **TaskHub Backend** - a NestJS-based REST API for a project management system. The project helps Team Leaders and Project Managers organize tasks, manage teams, track workloads, and monitor deadlines.

**Technology Stack:**

- Framework: NestJS 11 with TypeScript (strict mode)
- Database: PostgreSQL with TypeORM or Prisma
- Cache: Redis
- Authentication: JWT with Passport.js
- Real-time: Socket.io
- Testing: Jest (target 80%+ coverage)
- Documentation: Swagger/OpenAPI

## Core Development Principles

### 1. Architecture & Patterns

- **Always follow NestJS module structure**: Each feature should have its own module with `*.module.ts`, `*.service.ts`, `*.controller.ts`, and `*.spec.ts`
- **Use dependency injection**: Always inject dependencies through constructor, never use `new` keyword
- **Follow existing patterns**: Check `src/auth/` and `src/health/` for reference implementations
- **Modular design**: Each domain (users, projects, tasks, teams) should be a separate module
- **Separation of concerns**: Controllers handle HTTP, Services contain business logic, Entities represent data

### 2. Database & Entities

- **Always use UUID primary keys**: Never use auto-incrementing integers
- **Include timestamps**: All entities must have `created_at` and `updated_at` fields
- **Use enum types**: For status fields (active/completed/on_hold), priority (low/medium/high/critical), roles (admin/manager/member)
- **Foreign key constraints**: Always define relationships with proper foreign keys for referential integrity
- **Database indexes**: Add indexes on frequently queried columns (user_id, project_id, status, deadline)
- **Entity relationships**: Follow the schema in `projectplan/plan.md` - 9 core entities: Users, Projects, Teams, Tasks, Assignments, Subtasks, Time_Tracking, Notifications, Comments

### 3. DTOs & Validation

- **Always create DTOs**: Create separate DTOs for Create, Update, and Query operations
- **Use class-validator**: All DTOs must use validation decorators (`@IsString()`, `@IsNotEmpty()`, `@MinLength()`, etc.)
- **Naming convention**: `Create[Entity]Dto`, `Update[Entity]Dto`, `Query[Entity]Dto`
- **Location**: DTOs go in `dto/` subdirectory within each module
- **Whitelist enabled**: The global ValidationPipe strips unknown properties - ensure DTOs are complete

### 4. API Endpoints & Controllers

- **RESTful conventions**: Use standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
- **API versioning**: All endpoints are versioned via URI (`/v1/...`)
- **Swagger documentation**: Always add `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` decorators
- **Authentication**: Protected routes must use `@UseGuards(JwtAuthGuard)` and `@ApiBearerAuth('JWT-auth')`
- **Consistent responses**: Follow the error response format from `AllExceptionsFilter`
- **Pagination**: List endpoints must support pagination with `page`, `limit`, `sort`, `order` query parameters
- **Filtering**: Implement filtering by relevant fields (status, date ranges, assigned_to, etc.)

### 5. Services & Business Logic

- **Service methods**: All database operations go in services, never in controllers
- **Error handling**: Use NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`, `UnauthorizedException`)
- **Transaction support**: Use TypeORM transactions for multi-step operations
- **Return types**: Always explicitly type return values (Promise<Entity>, Promise<Entity[]>, etc.)
- **Logging**: Use Pino logger (injected via `Logger` from `@nestjs/common`) for important operations

### 6. Authentication & Authorization

- **Password hashing**: Always use bcrypt with minimum 10 rounds (never store plain text passwords)
- **JWT tokens**: Use existing utilities in `src/utils/jwt.utils.ts` for token generation
- **Token storage**: Store tokens in httpOnly cookies to prevent XSS attacks (not localStorage)
- **Refresh tokens**: Implement refresh token mechanism for extended sessions
- **Token blacklisting**: Use Redis for token blacklisting on logout
- **RBAC**: Implement role-based access control with guards for admin, manager, member roles
- **Rate limiting**: Authentication endpoints must have stricter rate limiting to prevent brute force

### 7. Security Requirements

- **Input validation**: Never trust user input - always validate with class-validator
- **SQL injection prevention**: Use parameterized queries (TypeORM handles this, but be aware)
- **XSS prevention**: Never return raw user input in responses without sanitization
- **CORS**: Configured globally - ensure credentials are handled correctly
- **Helmet**: Security headers are applied globally - don't disable
- **Rate limiting**: ThrottlerModule is configured globally - adjust per-endpoint if needed
- **Environment variables**: Never commit secrets - use environment validation in `src/config/environment.validation.ts`

### 8. Caching Strategy

- **Redis cache-aside pattern**: Implement for read-heavy operations (user profiles, project lists)
- **Cache invalidation**: Always invalidate cache on create, update, delete operations
- **TTL values**: Set appropriate TTL based on data volatility (user profiles: 1 hour, project lists: 30 minutes)
- **Graceful degradation**: Handle Redis failures gracefully - fall back to database
- **Cache keys**: Use consistent naming: `user:${id}`, `project:${id}`, `projects:list:${filters}`

### 9. Testing Requirements

- **Unit tests**: Write tests for all services (target 80%+ coverage)
- **Test files**: Always create `*.spec.ts` files alongside implementation files
- **Mock dependencies**: Mock database, Redis, and external services in tests
- **Test data**: Use factories or builders for test data creation
- **E2E tests**: Write E2E tests for critical user workflows (authentication, CRUD operations)
- **Test naming**: Use descriptive test names: `should create a project when valid data is provided`

### 10. Error Handling

- **Global exception filter**: Use the existing `AllExceptionsFilter` - don't create custom error responses
- **HTTP status codes**: Use appropriate status codes (200, 201, 400, 401, 403, 404, 500)
- **Error messages**: Provide clear, user-friendly error messages
- **Logging errors**: Log errors with context using the logger before throwing exceptions
- **Sentry integration**: Errors are automatically tracked - include relevant context in error messages

### 11. Code Quality & Style

- **TypeScript strict mode**: Enabled - ensure all types are explicit
- **ESLint & Prettier**: Code is automatically formatted - ensure compliance
- **JSDoc comments**: Add JSDoc comments for complex functions and classes
- **Naming conventions**:
  - Classes: PascalCase (`ProjectsService`)
  - Files: kebab-case (`projects.service.ts`)
  - Variables: camelCase (`projectId`)
  - Constants: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Imports**: Group imports (NestJS, third-party, local) with blank lines between groups

### 12. Documentation

- **Swagger/OpenAPI**: All endpoints must be documented with Swagger decorators
- **README updates**: Update README.md when adding major features
- **Code comments**: Add comments for complex business logic
- **API examples**: Include request/response examples in Swagger documentation

### 13. Development Priorities

**Always check `projectplan/backend-priorities.md` before implementing features:**

1. **Priority 1 (CRITICAL)**: PostgreSQL setup, Docker configuration, Database schema
2. **Priority 2 (HIGH)**: Complete authentication, RBAC, Core REST APIs
3. **Priority 3 (MEDIUM)**: Redis caching, WebSocket, Advanced features
4. **Priority 4 (LOW)**: Analytics, Reporting, Export features

**Don't skip priorities** - implement features in the order specified in `backend-priorities.md`.

### 14. Module Structure Template

When creating a new module, follow this structure:

```
src/
  [module-name]/
    [module-name].module.ts       # Module definition with imports/exports
    [module-name].service.ts       # Business logic
    [module-name].controller.ts    # HTTP endpoints
    [module-name].spec.ts          # Unit tests
    entities/
      [entity].entity.ts           # TypeORM entity
    dto/
      create-[entity].dto.ts       # Create DTO with validation
      update-[entity].dto.ts       # Update DTO with validation
      query-[entity].dto.ts        # Query/filter DTO
```

### 15. Real-time Features (Socket.io)

- **Authentication**: Authenticate WebSocket connections using JWT
- **Rooms**: Use Socket.io rooms to broadcast to relevant users only (project rooms, team rooms)
- **Events**: Use consistent event naming: `task.created`, `task.updated`, `task.deleted`
- **Error handling**: Implement exponential backoff for reconnection
- **Presence**: Track user presence for real-time indicators

### 16. Environment Configuration

- **Environment variables**: Always add new variables to `src/config/environment.validation.ts`
- **Validation**: Use class-validator decorators for environment variable validation
- **Default values**: Provide sensible defaults where appropriate
- **Documentation**: Document new environment variables in README or `.env.example`

### 17. Database Migrations

- **Migration files**: Always create migration files for schema changes (never modify entities directly in production)
- **Reversible migrations**: Include both `up()` and `down()` methods
- **Naming**: Use descriptive migration names with timestamps
- **Indexes**: Add indexes in migrations, not just in entity decorators
- **Data migrations**: Separate data migrations from schema migrations

### 18. Performance Considerations

- **Pagination**: Always implement pagination for list endpoints (default: 20 items per page, max: 100)
- **Database queries**: Use query builders for complex queries, avoid N+1 problems with proper relations
- **Connection pooling**: Database connection pooling is configured - monitor connection usage
- **Caching**: Cache frequently accessed, rarely updated data
- **Lazy loading**: Be aware of lazy vs eager loading in TypeORM relationships

### 19. Git & Version Control

- **Branching**: Follow GitFlow (main, develop, feature/\* branches)
- **Commit messages**: Use semantic commit messages (feat:, fix:, docs:, refactor:)
- **Pre-commit hooks**: Husky runs linting and formatting - ensure code passes before committing
- **Pull requests**: Reference related issues and document changes in PR descriptions

### 20. References & Documentation

**Always reference these files when implementing features:**

- **Project Plan**: `projectplan/plan.md` - Full development plan and architecture
- **Backend Priorities**: `projectplan/backend-priorities.md` - Prioritized task list
- **Implementation Checklist**: `projectplan/implementation-checklist.md` - Track progress
- **Cursor Prompts**: `.cursor/prompts.md` - Prompt templates for AI assistance
- **Existing Code**: Check `src/auth/` and `src/health/` for patterns

### 21. What NOT to Do

- ❌ **Don't** skip validation - always validate user input
- ❌ **Don't** store passwords in plain text - always hash with bcrypt
- ❌ **Don't** create duplicate functionality - check existing code first
- ❌ **Don't** bypass guards - always use authentication/authorization guards
- ❌ **Don't** ignore TypeScript errors - fix all type errors
- ❌ **Don't** skip tests - write tests for new features
- ❌ **Don't** hardcode values - use environment variables
- ❌ **Don't** create circular dependencies - structure modules properly
- ❌ **Don't** ignore linting errors - fix all ESLint warnings
- ❌ **Don't** implement features out of priority order - check `backend-priorities.md`

### 22. Code Review Checklist

Before considering code complete, ensure:

- [ ] All DTOs have validation decorators
- [ ] All endpoints have Swagger documentation
- [ ] Protected routes have authentication guards
- [ ] Services have unit tests (80%+ coverage)
- [ ] Error handling is implemented
- [ ] Logging is added for important operations
- [ ] Environment variables are validated
- [ ] TypeScript strict mode passes
- [ ] ESLint passes without warnings
- [ ] Code follows existing patterns

---

**Remember**: This is a production-ready project management system. Code quality, security, and maintainability are paramount. Always prioritize these over speed of development.

For detailed implementation guidance, refer to `projectplan/plan.md` and `projectplan/backend-priorities.md`.
