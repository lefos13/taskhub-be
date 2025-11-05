import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtUtils, JwtPayload } from '../utils/jwt.utils';

// Extend the Request interface to include the decoded JWT payload
import 'express';

declare module 'express-serve-static-core' {
  interface Request {
    jwtPayload?: JwtPayload;
  }
}

/**
 * JwtAuthGuard protects routes by validating JWT tokens in the Authorization header.
 * Attaches the decoded JWT payload to the request object for downstream use.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  /**
   * Determines if the request can proceed based on JWT validation.
   * @param context - The execution context containing the HTTP request
   * @returns true if the JWT is valid, otherwise throws UnauthorizedException
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    // Extract token from the Authorization header
    const token = JwtUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      // No token provided
      throw new UnauthorizedException('No authorization token provided');
    }

    if (!JwtUtils.isValidTokenFormat(token)) {
      // Token format is invalid (e.g., not Bearer)
      throw new UnauthorizedException('Invalid token format');
    }

    try {
      // Retrieve JWT secret from environment variables
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        // Secret not configured
        throw new UnauthorizedException('JWT configuration error');
      }

      // Verify the token and decode the payload
      const payload = JwtUtils.verifyToken(token, jwtSecret);

      // Attach the decoded payload to the request object
      request.jwtPayload = payload;

      return true;
    } catch (error) {
      // Token verification failed
      throw new UnauthorizedException(
        error instanceof Error ? error.message : 'Token verification failed',
      );
    }
  }
}
