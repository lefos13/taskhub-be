import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

/**
 * Database service for database operations and health checks.
 *
 * @module DatabaseService
 *
 * @remarks
 * This service provides utilities for database connectivity checks and operations.
 *
 * @decorator `@Injectable`
 */
@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Checks if the database connection is active.
   *
   * @returns {boolean} True if the database is connected, false otherwise.
   */
  isConnected(): boolean {
    try {
      return this.dataSource.isInitialized;
    } catch (error) {
      this.logger.error('Database connection check failed', error);
      return false;
    }
  }

  /**
   * Tests the database connection by executing a simple query.
   *
   * @returns {Promise<boolean>} True if the query succeeds, false otherwise.
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('Database connection test successful');
      return true;
    } catch (error) {
      this.logger.error('Database connection test failed', error);
      return false;
    }
  }

  /**
   * Gets database connection information.
   *
   * @returns {object} Database connection metadata.
   */
  getConnectionInfo(): {
    isConnected: boolean;
    database: string;
    host: string;
    port: number;
    driver: string;
  } {
    const options = this.dataSource.options as {
      host?: string;
      port?: number;
      database?: string;
      type?: string;
    };

    return {
      isConnected: this.dataSource.isInitialized,
      database: options.database || 'unknown',
      host: options.host || 'unknown',
      port: options.port || 5432,
      driver: options.type || 'unknown',
    };
  }
}
