import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseService } from './database.service';

/**
 * Database module for TypeORM configuration.
 *
 * @module DatabaseModule
 *
 * @remarks
 * This module configures TypeORM with PostgreSQL database connection.
 * It uses environment variables for configuration and includes connection pooling.
 *
 * @decorator `@Module`
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const isTest = configService.get('NODE_ENV') === 'test';

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: Number.parseInt(
            configService?.get<string>('DB_PORT') || '5432',
            10,
          ),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          // Connection pooling configuration
          extra: {
            max: 10, // Maximum number of connections in the pool
            min: 2, // Minimum number of connections in the pool
            idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
            connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
          },
          // Auto-sync schema (only in development, disabled in production)
          synchronize:
            configService.get<string>('DB_SYNCHRONIZE') === 'true' &&
            !isProduction,
          // Logging (disabled in production, enabled in development)
          logging:
            configService.get<string>('DB_LOGGING') === 'true' && !isProduction,
          // Entities path (will be set when entities are created)
          entities: [process.cwd() + '/src/**/*.entity{.ts,.js}'],
          // Migrations path
          migrations: [process.cwd() + '/src/migrations/*{.ts,.js}'],
          migrationsRun: false, // Don't run migrations automatically
          // SSL configuration for production
          ssl: isProduction
            ? {
                rejectUnauthorized: false,
              }
            : false,
          // Test database configuration
          dropSchema: isTest,
        };
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
