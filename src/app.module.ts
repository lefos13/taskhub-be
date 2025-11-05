import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { EnvironmentVariables } from './config/environment.validation';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

/**
 * The root module of the NestJS application.
 *
 * @module AppModule
 *
 * @remarks
 * This module configures and imports all core modules and services required for the application,
 * including logging, configuration validation, rate limiting, health checks, HTTP client, metrics,
 * authentication, and health endpoints.
 *
 * @decorator `@Module`
 *
 * @imports
 * - `LoggerModule`: Provides structured logging using Pino, with pretty-printing in non-production environments.
 * - `ConfigModule`: Loads and validates environment variables globally using a custom validation schema.
 * - `ThrottlerModule`: Applies global rate limiting to incoming requests.
 * - `TerminusModule`: Enables health check endpoints.
 * - `HttpModule`: Provides HTTP client capabilities.
 * - `PrometheusModule`: Exposes Prometheus metrics at `/metrics`.
 * - `AuthModule`: Handles authentication logic.
 * - `HealthModule`: Implements health check endpoints.
 *
 * @controllers
 * - `AppController`: The main application controller.
 *
 * @providers
 * - `AppService`: The main application service.
 * - `APP_GUARD` with `ThrottlerGuard`: Applies rate limiting globally.
 */
@Module({
  imports: [
    // Structured logging with Pino
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        customProps: () => ({
          context: 'HTTP',
        }),
        autoLogging: false, // We'll manually log to avoid type issues
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config: Record<string, unknown>) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: true,
        });
        const errors = validateSync(validatedConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          throw new Error(
            `Configuration validation failed:\n${errors
              .map((err) => Object.values(err.constraints || {}).join(', '))
              .join('\n')}`,
          );
        }
        return validatedConfig;
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests per ttl
      },
    ]),
    // Health checks
    TerminusModule,
    HttpModule,
    // Prometheus metrics
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: {
        enabled: true,
      },
    }),
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
