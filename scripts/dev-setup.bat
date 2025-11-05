@echo off
REM TaskHub Development Setup Script for Windows

echo 🚀 Setting up TaskHub development environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Copy environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from .env.development...
    copy .env.development .env
) else (
    echo ✅ .env file already exists
)

REM Start Docker services
echo 🐳 Starting Docker services...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if PostgreSQL is ready
echo 🔍 Checking PostgreSQL connection...
:wait_postgres
docker-compose exec postgres pg_isready -U taskhub_user -d taskhub_db >nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for PostgreSQL...
    timeout /t 2 /nobreak >nul
    goto wait_postgres
)

REM Check if Redis is ready
echo 🔍 Checking Redis connection...
:wait_redis
docker-compose exec redis redis-cli -a redis_password ping >nul 2>&1
if %errorlevel% neq 0 (
    echo Waiting for Redis...
    timeout /t 2 /nobreak >nul
    goto wait_redis
)

echo ✅ All services are ready!

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
)

REM Run migrations
echo 🗄️  Running database migrations...
npm run migration:run

echo 🎉 Development environment is ready!
echo.
echo Available services:
echo   - PostgreSQL: localhost:5432
echo   - Redis: localhost:6379
echo   - pgAdmin: http://localhost:8080 (admin@example.com / admin123)
echo.
echo To start the application:
echo   npm run start:dev
echo.
echo To stop services:
echo   docker-compose down

pause