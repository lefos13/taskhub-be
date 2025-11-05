import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUtils } from '../utils/jwt.utils';

export interface TokenResponse {
  token: string;
  deviceId: string;
  expiresIn: string;
  issuedAt: Date;
}

@Injectable()
export class AuthService {
  // In-memory storage for device-token mapping
  // In production, use a database like Redis or PostgreSQL
  private deviceTokenMap = new Map<string, string>();

  constructor(private configService: ConfigService) {}

  /**
   * Generates a JWT token for a given device ID
   * @param deviceId - The device identifier
   * @returns Token response with token details
   */
  generateToken(deviceId: string): TokenResponse {
    if (!deviceId || deviceId.trim().length === 0) {
      throw new Error('Device ID is required');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '1h';

    if (!jwtSecret) {
      throw new Error('JWT secret is not configured');
    }

    // Generate the JWT token
    const token = JwtUtils.generateToken(deviceId.trim(), jwtSecret, expiresIn);

    // Store the device-token mapping
    this.deviceTokenMap.set(deviceId.trim(), token);

    return {
      token,
      deviceId: deviceId.trim(),
      expiresIn,
      issuedAt: new Date(),
    };
  }

  /**
   * Retrieves the stored token for a device ID
   * @param deviceId - The device identifier
   * @returns The stored token or null if not found
   */
  getStoredToken(deviceId: string): string | null {
    return this.deviceTokenMap.get(deviceId) || null;
  }

  /**
   * Removes the stored token for a device ID
   * @param deviceId - The device identifier
   */
  revokeToken(deviceId: string): void {
    this.deviceTokenMap.delete(deviceId);
  }

  /**
   * Gets all active device-token mappings
   * @returns Map of device IDs to tokens
   */
  getAllActiveTokens(): Map<string, string> {
    return new Map(this.deviceTokenMap);
  }

  /**
   * Validates if a device has a valid stored token
   * @param deviceId - The device identifier
   * @param token - The token to validate
   * @returns True if the token matches the stored token for the device
   */
  isValidStoredToken(deviceId: string, token: string): boolean {
    const storedToken = this.deviceTokenMap.get(deviceId);
    return storedToken === token;
  }
}
