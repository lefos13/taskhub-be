import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  /**
   * Injects health check and indicator services.
   * @param health - Terminus health check service
   * @param http - HTTP health indicator (not used in current checks)
   * @param memory - Memory health indicator
   * @param disk - Disk health indicator
   */
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * Performs a comprehensive health check including memory and disk metrics.
   * @returns Health check result with memory and disk status.
   */
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Health check',
    description: 'Comprehensive health check with memory and disk metrics',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        info: {
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
          storage: { status: 'up' },
        },
        error: {},
        details: {
          memory_heap: { status: 'up' },
          memory_rss: { status: 'up' },
          storage: { status: 'up' },
        },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  check() {
    return this.health.check([
      // Check memory heap usage (should be below 150MB)
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Check RSS memory usage (should be below 300MB)
      () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
      // Check disk storage (should have at least 50% free space)
      () =>
        this.disk.checkStorage('storage', {
          path: 'C:\\',
          thresholdPercent: 0.5,
        }),
    ]);
  }

  /**
   * Liveness probe endpoint.
   * Returns healthy if the application process is running.
   * @returns Health check result for liveness.
   */
  @Get('liveness')
  @HealthCheck()
  @ApiOperation({
    summary: 'Liveness probe',
    description: 'Checks if the application is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is alive',
    schema: {
      example: {
        status: 'ok',
        info: { memory_heap: { status: 'up' } },
        error: {},
        details: { memory_heap: { status: 'up' } },
      },
    },
  })
  liveness() {
    // Simple liveness check - if this responds, the app is alive
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
    ]);
  }

  /**
   * Readiness probe endpoint.
   * Returns healthy if the application is ready to accept requests.
   * Extend this with checks for external dependencies (e.g., database).
   * @returns Health check result for readiness.
   */
  @Get('readiness')
  @HealthCheck()
  @ApiOperation({
    summary: 'Readiness probe',
    description: 'Checks if the application is ready to accept requests',
  })
  @ApiResponse({
    status: 200,
    description: 'Application is ready',
    schema: {
      example: {
        status: 'ok',
        info: { memory_heap: { status: 'up' } },
        error: {},
        details: { memory_heap: { status: 'up' } },
      },
    },
  })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  readiness() {
    // Readiness check - includes memory and (optionally) external dependencies
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
      // Add database check here when you have a database
      // () => this.db.pingCheck('database'),
    ]);
  }
}
