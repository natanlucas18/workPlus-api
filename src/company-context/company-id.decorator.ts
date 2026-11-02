import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface CompanyRequest extends Request {
  companyId?: string;
}

export const CompanyId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<CompanyRequest>();

    return request.companyId;
  },
);
