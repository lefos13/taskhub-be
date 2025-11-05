/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppDataSource } from './typeorm.config';

/**
 * Test database connection script.
 * This script can be run independently to verify database connectivity.
 */
async function testDatabaseConnection(): Promise<void> {
  try {
    console.log('🔄 Testing database connection...');

    // Initialize the data source
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully!');

    // Test a simple query
    const result = await AppDataSource.query('SELECT NOW() as current_time');
    console.log('✅ Database query test successful:', result[0]);

    // Get connection info
    const { driver, options } = AppDataSource;
    console.log('📊 Connection Info:');
    console.log(`  - Driver: ${driver.constructor.name}`);
    console.log(`  - Database: ${(options as any).database}`);
    console.log(`  - Host: ${(options as any).host}:${(options as any).port}`);
  } catch (error: any) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDatabaseConnection();
}

export { testDatabaseConnection };
