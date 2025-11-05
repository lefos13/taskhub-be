# Database Setup and Configuration

This directory contains the database configuration and migration infrastructure for the TaskHub project.

## Files Overview

- `database.module.ts` - NestJS module for TypeORM configuration
- `database.service.ts` - Service for database operations and health checks
- `typeorm.config.ts` - TypeORM configuration for CLI operations and migrations
- `test-connection.ts` - Standalone script to test database connectivity
- `migrations/` - Directory containing database migration files

## Environment Variables

The following environment variables are required for database configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskhub_user
DB_PASSWORD=taskhub_password
DB_NAME=taskhub_db
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

## Database Setup

### 1. PostgreSQL Installation

Install PostgreSQL on your system:

**Windows:**

```bash
# Using Chocolatey
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

**macOS:**

```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Database and User Creation

Connect to PostgreSQL and create the database and user:

```sql
-- Connect as postgres user
sudo -u postgres psql

-- Create database
CREATE DATABASE taskhub_db;

-- Create user
CREATE USER taskhub_user WITH PASSWORD 'taskhub_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE taskhub_db TO taskhub_user;

-- Exit
\q
```

### 3. Test Database Connection

Run the connection test script:

```bash
npm run db:test
```

This will verify that the application can connect to the database successfully.

## Migration Commands

### Generate Migration

Generate a new migration based on entity changes:

```bash
npm run migration:generate -- src/migrations/CreateInitialSchema
```

### Create Empty Migration

Create an empty migration file:

```bash
npm run migration:create -- src/migrations/AddIndexes
```

### Run Migrations

Execute pending migrations:

```bash
npm run migration:run
```

### Revert Migration

Revert the last executed migration:

```bash
npm run migration:revert
```

### Show Migration Status

Display migration status:

```bash
npm run migration:show
```

## Development vs Production

### Development

- `DB_SYNCHRONIZE=false` - Always use migrations, never auto-sync
- `DB_LOGGING=true` - Enable query logging for debugging

### Production

- `DB_SYNCHRONIZE=false` - Never auto-sync in production
- `DB_LOGGING=false` - Disable logging for performance
- SSL connection enabled automatically
- Connection pooling configured for high load

## Connection Pooling

The database module is configured with connection pooling:

- **Maximum connections**: 10
- **Minimum connections**: 2
- **Idle timeout**: 30 seconds
- **Connection timeout**: 2 seconds

## Health Checks

The `DatabaseService` provides methods for health checking:

- `isConnected()` - Check if database is connected
- `testConnection()` - Execute a test query
- `getConnectionInfo()` - Get connection metadata

These are used by the health check endpoints in the application.
