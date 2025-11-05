#!/bin/bash

# TaskHub Development Setup Script
echo "🚀 Setting up TaskHub development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.development..."
    cp .env.development .env
else
    echo "✅ .env file already exists"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is ready
echo "🔍 Checking PostgreSQL connection..."
until docker-compose exec postgres pg_isready -U taskhub_user -d taskhub_db; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

# Check if Redis is ready
echo "🔍 Checking Redis connection..."
until docker-compose exec redis redis-cli -a redis_password ping; do
    echo "Waiting for Redis..."
    sleep 2
done

echo "✅ All services are ready!"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run migrations
echo "🗄️  Running database migrations..."
npm run migration:run

echo "🎉 Development environment is ready!"
echo ""
echo "Available services:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - pgAdmin: http://localhost:8080 (admin@example.com / admin123)"
echo ""
echo "To start the application:"
echo "  npm run start:dev"
echo ""
echo "To stop services:"
echo "  docker-compose down"