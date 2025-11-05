# TaskHub Backend - Development Guide

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd taskhub-be

# Run the automated setup script
npm run dev:setup
```

The setup script will:

- Create `.env` file from `.env.development`
- Start PostgreSQL and Redis containers
- Install dependencies
- Run database migrations
- Verify all services are ready

### 2. Start Development

```bash
# Start the application in development mode
npm run start:dev
```

The application will be available at `http://localhost:3000`

## Manual Setup

If you prefer to set up manually:

### 1. Environment Configuration

```bash
# Copy environment template
cp .env.development .env

# Edit .env file with your preferences (optional)
```

### 2. Start Database Services

```bash
# Start PostgreSQL and Redis
npm run docker:up

# Check service status
docker-compose ps
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Migrations

```bash
npm run migration:run
```

### 5. Start Application

```bash
npm run start:dev
```

## Available Services

| Service               | URL                            | Credentials                     |
| --------------------- | ------------------------------ | ------------------------------- |
| **Application**       | http://localhost:3000          | -                               |
| **API Documentation** | http://localhost:3000/api-docs | -                               |
| **PostgreSQL**        | localhost:5432                 | taskhub_user / taskhub_password |
| **Redis**             | localhost:6379                 | redis_password                  |
| **pgAdmin**           | http://localhost:8080          | admin@example.com / admin123    |

## Development Scripts

### Application Scripts

```bash
npm run start:dev      # Start in development mode with hot reload
npm run start:debug    # Start in debug mode
npm run build          # Build for production
npm run test           # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
```

### Database Scripts

```bash
npm run migration:generate -- --name MigrationName  # Generate migration
npm run migration:create -- src/migrations/Name     # Create empty migration
npm run migration:run                                # Run pending migrations
npm run migration:revert                             # Revert last migration
npm run migration:show                               # Show migration status
npm run db:reset                                     # Reset database completely
```

### Docker Scripts

```bash
npm run docker:up      # Start all services
npm run docker:down    # Stop all services
npm run docker:logs    # View service logs
```

### Validation Scripts

```bash
npm run validate       # Validate development environment setup
```

## Database Management

### Connecting to PostgreSQL

**Using psql:**

```bash
# Connect via Docker
docker-compose exec postgres psql -U taskhub_user -d taskhub_db

# Connect directly (if PostgreSQL client installed)
psql -h localhost -p 5432 -U taskhub_user -d taskhub_db
```

**Using pgAdmin:**

1. Open http://localhost:8080
2. Login with `admin@example.com` / `admin123`
3. Add server:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `taskhub_db`
   - Username: `taskhub_user`
   - Password: `taskhub_password`

### Reset Database

To completely reset the database:

```bash
npm run db:reset
```

This will:

- Drop and recreate the database
- Run initialization scripts
- Apply all migrations

## Redis Management

### Connecting to Redis

```bash
# Connect via Docker
docker-compose exec redis redis-cli -a redis_password

# Connect directly (if Redis client installed)
redis-cli -h localhost -p 6379 -a redis_password
```

### Common Redis Commands

```bash
# Check connection
PING

# List all keys
KEYS *

# Clear all data
FLUSHALL

# Get info
INFO
```

## Troubleshooting

### Port Conflicts

If you have port conflicts, you can modify the ports in `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - '5433:5432' # Change to different port
  redis:
    ports:
      - '6380:6379' # Change to different port
```

Don't forget to update your `.env` file accordingly.

### Database Connection Issues

1. **Check if containers are running:**

   ```bash
   docker-compose ps
   ```

2. **Check container logs:**

   ```bash
   docker-compose logs postgres
   docker-compose logs redis
   ```

3. **Restart services:**
   ```bash
   docker-compose restart
   ```

### Migration Issues

1. **Check migration status:**

   ```bash
   npm run migration:show
   ```

2. **Reset migrations (⚠️ This will lose data):**
   ```bash
   npm run db:reset
   ```

### Clean Restart

To completely clean and restart:

```bash
# Stop all services
docker-compose down -v

# Remove all data volumes (⚠️ This will lose all data)
docker volume prune

# Start fresh
npm run dev:setup
```

## Environment Variables

Key environment variables for development:

| Variable         | Description       | Default            |
| ---------------- | ----------------- | ------------------ |
| `NODE_ENV`       | Environment mode  | `development`      |
| `PORT`           | Application port  | `3000`             |
| `DB_HOST`        | Database host     | `localhost`        |
| `DB_PORT`        | Database port     | `5432`             |
| `DB_USERNAME`    | Database username | `taskhub_user`     |
| `DB_PASSWORD`    | Database password | `taskhub_password` |
| `DB_NAME`        | Database name     | `taskhub_db`       |
| `DB_SYNCHRONIZE` | Auto-sync schema  | `false`            |
| `DB_LOGGING`     | Enable DB logging | `true`             |
| `REDIS_HOST`     | Redis host        | `localhost`        |
| `REDIS_PORT`     | Redis port        | `6379`             |
| `REDIS_PASSWORD` | Redis password    | `redis_password`   |
| `JWT_SECRET`     | JWT secret key    | `your-secret-key`  |

## Next Steps

- Check out the [API Documentation](http://localhost:3000/api-docs) when the app is running
- Review the [Project Structure](../README.md#project-structure)
- Read the [Contributing Guidelines](../CONTRIBUTING.md)
- Explore the [Testing Guide](./TESTING.md)
