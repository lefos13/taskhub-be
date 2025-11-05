import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Load environment variables
config();

const configService = new ConfigService();

/**
 * TypeORM configuration for migrations and CLI operations.
 * This configuration is used by TypeORM CLI commands for generating and running migrations.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: Number.parseInt(configService.get<string>('DB_PORT') || '5432', 10),
  username: configService.get<string>('DB_USERNAME') || 'taskhub_user',
  password: configService.get<string>('DB_PASSWORD') || 'taskhub_password',
  database: configService.get<string>('DB_NAME') || 'taskhub_db',

  // Entity and migration paths
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  // Migration settings
  migrationsTableName: 'migrations',
  migrationsRun: false,

  // Logging
  logging: configService.get<string>('DB_LOGGING') === 'true',

  // SSL configuration for production
  ssl:
    configService.get<string>('NODE_ENV') === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
