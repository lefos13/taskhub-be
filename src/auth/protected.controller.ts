import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetJwtPayload, DeviceId } from '../auth/jwt.decorators';
import type { JwtPayload } from '../utils/jwt.utils';

/**
 * Controller for protected routes that require JWT authentication.
 */
@ApiTags('protected')
@ApiBearerAuth('JWT-auth')
@Controller('protected') // Sets the route prefix to /protected
@UseGuards(JwtAuthGuard) // Applies JWT authentication guard to all routes in this controller
export class ProtectedController {
  /**
   * Returns the profile information extracted from the JWT payload.
   * @param payload - The decoded JWT payload
   */
  @Get('profile') // Handles GET requests to /protected/profile
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Returns profile information from JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    schema: {
      example: {
        message: 'This is a protected route',
        deviceId: 'device123',
        tokenIssuedAt: '2024-01-15T10:30:00.000Z',
        tokenExpiresAt: '2024-01-15T11:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  getProfile(@GetJwtPayload() payload: JwtPayload) {
    return {
      message: 'This is a protected route', // Informational message
      deviceId: payload.deviceId, // Device ID from JWT payload
      tokenIssuedAt: payload.iat ? new Date(payload.iat * 1000) : null, // Token issue time (converted from seconds to Date)
      tokenExpiresAt: payload.exp ? new Date(payload.exp * 1000) : null, // Token expiration time (converted from seconds to Date)
    };
  }

  /**
   * Returns device information for the authenticated request.
   * @param deviceId - The device ID extracted from the JWT
   */
  @Get('device-info') // Handles GET requests to /protected/device-info
  @ApiOperation({
    summary: 'Get device information',
    description: 'Returns device info from JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Device info retrieved successfully',
    schema: {
      example: {
        message: 'Device information',
        deviceId: 'device123',
        timestamp: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing token',
  })
  getDeviceInfo(@DeviceId() deviceId: string) {
    return {
      message: 'Device information', // Informational message
      deviceId, // Device ID from custom decorator
      timestamp: new Date(), // Current server timestamp
    };
  }
}
