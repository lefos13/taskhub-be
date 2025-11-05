import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { GetTokenDto } from './dto/get-token.dto';

/**
 * Controller responsible for authentication-related endpoints.
 *
 * @remarks
 * Handles authentication requests such as token generation.
 */
@ApiTags('auth')
@Controller('auth') // Defines the route prefix for all endpoints in this controller as '/auth'
export class AuthController {
  // Injects the AuthService using NestJS dependency injection
  constructor(private readonly authService: AuthService) {}

  @Post('token') // Handles POST requests to '/auth/token'
  @HttpCode(HttpStatus.OK) // Sets the HTTP response status code to 200 OK
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // Rate limit: 5 requests per minute
  @ApiOperation({
    summary: 'Generate JWT token',
    description: 'Creates a JWT token for a given device ID',
  })
  @ApiBody({ type: GetTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token generated successfully',
    schema: {
      example: {
        success: true,
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          deviceId: 'device123',
          expiresIn: '1h',
          issuedAt: '2024-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid device ID' })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  })
  getToken(@Body() getTokenDto: GetTokenDto) {
    try {
      // Calls the AuthService to generate a token using the provided deviceId from the request body
      const result = this.authService.generateToken(getTokenDto.deviceId);
      // Returns a success response with the generated token data
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // Throws a BadRequestException if token generation fails, returning an appropriate error message
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to generate token',
      );
    }
  }
}
