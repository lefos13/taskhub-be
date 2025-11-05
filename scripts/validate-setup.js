#!/usr/bin/env node

/**
 * TaskHub Development Environment Validation Script
 *
 * This script validates that the development environment is properly configured
 * and all services can start successfully.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 TaskHub Development Environment Validation\n');

let hasErrors = false;

function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe' });
    console.log(`✅ ${description}`);
    return true;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message.split('\n')[0]}`);
    hasErrors = true;
    return false;
  }
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`);
    return true;
  } else {
    console.log(`❌ ${description}`);
    hasErrors = true;
    return false;
  }
}

// Check prerequisites
console.log('📋 Checking Prerequisites...');
checkCommand('node --version', 'Node.js is installed');
checkCommand('npm --version', 'npm is available');
checkCommand('docker --version', 'Docker is installed');
checkCommand('docker-compose --version', 'Docker Compose is available');

// Check if Docker is running
console.log('\n🐳 Checking Docker Status...');
checkCommand('docker info', 'Docker daemon is running');

// Check project files
console.log('\n📁 Checking Project Files...');
checkFile('package.json', 'package.json exists');
checkFile('docker-compose.yml', 'docker-compose.yml exists');
checkFile('src/users/entities/user.entity.ts', 'User entity exists');
checkFile('src/migrations', 'Migrations directory exists');

// Validate Docker Compose configuration
console.log('\n⚙️  Validating Configuration...');
checkCommand('docker-compose config', 'Docker Compose configuration is valid');

// Check if node_modules exists
console.log('\n📦 Checking Dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies are installed');
} else {
  console.log('⚠️  Dependencies not installed - run "npm install"');
}

// Check environment files
console.log('\n🔧 Checking Environment Configuration...');
checkFile('.env.development', 'Development environment template exists');
checkFile('.env.example', 'Environment example exists');

if (fs.existsSync('.env')) {
  console.log('✅ .env file exists');
} else {
  console.log('⚠️  .env file not found - will be created during setup');
}

// Summary
console.log('\n📊 Validation Summary');
console.log('='.repeat(50));

if (hasErrors) {
  console.log(
    '❌ Some issues were found. Please resolve them before proceeding.',
  );
  console.log('\n💡 Common solutions:');
  console.log('   - Install missing prerequisites');
  console.log('   - Start Docker Desktop');
  console.log('   - Run "npm install" to install dependencies');
  process.exit(1);
} else {
  console.log('✅ All checks passed! Your environment is ready.');
  console.log('\n🚀 Next steps:');
  console.log('   npm run dev:setup    # Complete automated setup');
  console.log('   npm run start:dev    # Start the application');
  console.log('\n📚 Documentation:');
  console.log('   docs/DEVELOPMENT.md  # Detailed development guide');
}
