import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from 'src/types/auth-request';

export const tokenPayloadParams = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context = ctx.switchToHttp();
    const request = context.getRequest<AuthRequest>();
    return request.tokenPayload;
  },
);
