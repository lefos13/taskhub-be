@echo off
REM TaskHub Database Reset Script for Windows

echo 🗄️  Resetting TaskHub database...

REM Stop the application if running
echo 🛑 Stopping application...
taskkill /f /im node.exe >nul 2>&1

REM Drop and recreate database
echo 🔄 Resetting database...
docker-compose exec postgres psql -U taskhub_user -d postgres -c "DROP DATABASE IF EXISTS taskhub_db;"
docker-compose exec postgres psql -U taskhub_user -d postgres -c "CREATE DATABASE taskhub_db;"

REM Run initialization script
echo 🔧 Running initialization...
docker-compose exec postgres psql -U taskhub_user -d taskhub_db -f /docker-entrypoint-initdb.d/01-init.sql

REM Run migrations
echo 🚀 Running migrations...
npm run migration:run

echo ✅ Database reset complete!
pause