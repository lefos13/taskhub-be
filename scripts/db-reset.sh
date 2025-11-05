#!/bin/bash

# TaskHub Database Reset Script
echo "🗄️  Resetting TaskHub database..."

# Stop the application if running
echo "🛑 Stopping application..."
pkill -f "nest start" || true

# Drop and recreate database
echo "🔄 Resetting database..."
docker-compose exec postgres psql -U taskhub_user -d postgres -c "DROP DATABASE IF EXISTS taskhub_db;"
docker-compose exec postgres psql -U taskhub_user -d postgres -c "CREATE DATABASE taskhub_db;"

# Run initialization script
echo "🔧 Running initialization..."
docker-compose exec postgres psql -U taskhub_user -d taskhub_db -f /docker-entrypoint-initdb.d/01-init.sql

# Run migrations
echo "🚀 Running migrations..."
npm run migration:run

echo "✅ Database reset complete!"