import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '@cleancare/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
