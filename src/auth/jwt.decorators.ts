import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../utils/jwt.utils';

/**
 * Custom decorator to extract JWT payload from the request
 * Usage: getCurrentUser(@JwtPayload() payload: JwtPayload)
 */
export const GetJwtPayload = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ jwtPayload?: JwtPayload }>();
    return request.jwtPayload as JwtPayload;
  },
);

/**
 * Custom decorator to extract device ID from JWT payload
 * Usage: getCurrentDeviceId(@DeviceId() deviceId: string)
 */
export const DeviceId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ jwtPayload?: JwtPayload }>();
    return request.jwtPayload?.deviceId ?? '';
  },
);
