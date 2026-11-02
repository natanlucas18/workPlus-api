import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserRoles } from 'src/enums/user-roles.enum';
import { JwtPayload } from 'src/types/jwt-payload';
import { Company } from 'src/company/entities/company.entity';

interface AuthenticatedRequest extends Request {
  user?: User & {
    tokenPayload: JwtPayload;
  };
  companyId?: string;
}

@Injectable()
export class CompanyContextGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado.');
    }

    let companyId: string;

    if (user.role === UserRoles.SUPER_ADMIN) {
      const selectedCompanyId = request.headers['x-company-id'];

      if (typeof selectedCompanyId !== 'string' || !selectedCompanyId.trim()) {
        throw new BadRequestException(
          'Informe a empresa que deseja administrar.',
        );
      }

      companyId = selectedCompanyId;

      if (!isUUID(companyId)) {
        throw new BadRequestException('Identificador de empresa inválido.');
      }

      const company = await this.companyRepository.findOne({
        where: {
          id: companyId,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      if (!company) {
        throw new NotFoundException('Empresa não encontrada ou inativa.');
      }

      request.companyId = company.id;

      return true;
    }

    const company = user.company;

    if (!company) {
      throw new ForbiddenException('Usuário não possui uma empresa vinculada.');
    }

    if (!company.isActive) {
      throw new ForbiddenException(
        'A empresa vinculada ao usuário está inativa.',
      );
    }

    request.companyId = company.id;

    return true;
  }
}
