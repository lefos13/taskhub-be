import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  deviceId: string;
  iat?: number;
  exp?: number;
}

export class JwtUtils {
  /**
   * Generates a JWT token for a given device ID
   * @param deviceId - The device identifier
   * @param secret - JWT secret key
   * @param expiresIn - Token expiration time (default: '1h')
   * @returns The generated JWT token
   */
  static generateToken(
    deviceId: string,
    secret: string,
    expiresIn: string = '1h',
  ): string {
    const payload: JwtPayload = { deviceId };
    const options: object = { expiresIn: expiresIn };
    return jwt.sign(payload, secret, options);
  }

  /**
   * Verifies a JWT token and returns the payload
   * @param token - The JWT token to verify
   * @param secret - JWT secret key
   * @returns The decoded payload if valid
   * @throws Error if token is invalid or expired
   */
  static verifyToken(token: string, secret: string): JwtPayload {
    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        throw new Error('Token verification failed');
      }
    }
  }

  /**
   * Extracts JWT token from Authorization header
   * @param authHeader - The Authorization header value
   * @returns The extracted token or null if not found
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) {
      return null;
    }

    // Check for Bearer token format
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (bearerMatch) {
      return bearerMatch[1];
    }

    // If no Bearer prefix, assume the entire header is the token
    return authHeader.trim() || null;
  }

  /**
   * Validates if a token exists and is properly formatted
   * @param token - The token to validate
   * @returns True if token exists and has proper format
   */
  static isValidTokenFormat(token: string | null): boolean {
    if (!token) {
      return false;
    }

    // Basic JWT format check (three parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3 && parts.every((part) => part.length > 0);
  }
}
