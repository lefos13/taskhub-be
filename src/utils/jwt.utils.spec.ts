import { JwtUtils } from './jwt.utils';

describe('JwtUtils', () => {
  const testSecret = 'test-secret-key';
  const testDeviceId = 'device-123';

  // Tests for the generateToken method
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      // Should return a defined, string token with 3 JWT parts
      const token = JwtUtils.generateToken(testDeviceId, testSecret);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should generate different tokens for different device IDs', () => {
      // Tokens for different device IDs should not be equal
      const token1 = JwtUtils.generateToken('device-1', testSecret);
      const token2 = JwtUtils.generateToken('device-2', testSecret);
      expect(token1).not.toBe(token2);
    });
  });

  // Tests for the verifyToken method
  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      // Should return the correct payload for a valid token
      const token = JwtUtils.generateToken(testDeviceId, testSecret);
      const payload = JwtUtils.verifyToken(token, testSecret);

      expect(payload).toBeDefined();
      expect(payload.deviceId).toBe(testDeviceId);
      expect(payload.iat).toBeDefined();
      expect(payload.exp).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      // Should throw an error if the token is invalid
      expect(() => {
        JwtUtils.verifyToken('invalid-token', testSecret);
      }).toThrow('Invalid token');
    });

    it('should throw error for wrong secret', () => {
      // Should throw an error if the secret is incorrect
      const token = JwtUtils.generateToken(testDeviceId, testSecret);
      expect(() => {
        JwtUtils.verifyToken(token, 'wrong-secret');
      }).toThrow('Invalid token');
    });
  });

  // Tests for the extractTokenFromHeader method
  describe('extractTokenFromHeader', () => {
    it('should extract token from Bearer header', () => {
      // Should extract the token from a Bearer header string
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const bearerHeader = `Bearer ${token}`;
      const extracted = JwtUtils.extractTokenFromHeader(bearerHeader);
      expect(extracted).toBe(token);
    });

    it('should return token if no Bearer prefix', () => {
      // Should return the token as-is if no Bearer prefix is present
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const extracted = JwtUtils.extractTokenFromHeader(token);
      expect(extracted).toBe(token);
    });

    it('should return null for undefined header', () => {
      // Should return null if the header is undefined
      const extracted = JwtUtils.extractTokenFromHeader(undefined);
      expect(extracted).toBeNull();
    });

    it('should return null for empty header', () => {
      // Should return null if the header is an empty string
      const extracted = JwtUtils.extractTokenFromHeader('');
      expect(extracted).toBeNull();
    });
  });

  // Tests for the isValidTokenFormat method
  describe('isValidTokenFormat', () => {
    it('should return true for valid JWT format', () => {
      // Should return true for a string with three dot-separated parts
      const validToken = 'header.payload.signature';
      expect(JwtUtils.isValidTokenFormat(validToken)).toBe(true);
    });

    it('should return false for invalid format', () => {
      // Should return false for invalid token formats
      expect(JwtUtils.isValidTokenFormat('invalid')).toBe(false);
      expect(JwtUtils.isValidTokenFormat('only.two')).toBe(false);
      expect(JwtUtils.isValidTokenFormat('too.many.parts.here')).toBe(false);
      expect(JwtUtils.isValidTokenFormat(null)).toBe(false);
      expect(JwtUtils.isValidTokenFormat('')).toBe(false);
    });
  });
});
