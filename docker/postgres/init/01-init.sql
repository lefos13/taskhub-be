-- Initialize TaskHub Database
-- This script runs when the PostgreSQL container starts for the first time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional extensions that might be useful
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE taskhub_db TO taskhub_user;

-- Log initialization
SELECT 'TaskHub database initialized successfully' AS status;