import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { isUniqueViolation } from 'src/database/utils/is-unique-violation';
import { CompanyResponseDto } from './dtos/company-response.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<ResponseDto<CompanyResponseDto>> {
    try {
      const companyData = this.companyRepository.create({
        name: createCompanyDto.name.trim().normalize('NFC'),
      });

      const newCompany = await this.companyRepository.save(companyData);
      return {
        data: {
          id: newCompany.id,
          name: newCompany.name,
          createdAt: newCompany.createdAt,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Já existe uma empresa cadastrada com esse nome!',
        );
      }

      throw error;
    }
  }

  async findAll(
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseDto<CompanyResponseDto>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb = this.companyRepository.createQueryBuilder('company');

    if (query.search?.trim()) {
      qb.andWhere('(company.name ILIKE :search)', {
        search: `${query.search.trim()}%`,
      });
    }

    const allowedSortBy = ['name', 'createdAt'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`company.${sortBy}`, sortOrder);
    qb.addOrderBy('company.id', 'ASC');

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt ?? null,
      })),
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findAllDeleted(
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseDto<CompanyResponseDto>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb = this.companyRepository
      .createQueryBuilder('company')
      .withDeleted()
      .andWhere('company.deleted_at IS NOT NULL');

    if (query.search?.trim()) {
      qb.andWhere('(company.name ILIKE :search)', {
        search: `${query.search.trim()}%`,
      });
    }

    const allowedSortBy = ['name', 'createdAt'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`company.${sortBy}`, sortOrder);
    qb.addOrderBy('company.id', 'ASC');

    qb.skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => ({
        id: item.name,
        name: item.name,
        createdAt: item.createdAt ?? null,
      })),
      meta: {
        page,
        limit,
        totalItems: total,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findOne(id: string): Promise<ResponseDto<CompanyResponseDto>> {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return {
      data: {
        id: company.id,
        name: company.name,
        createdAt: company.createdAt,
      },
    };
  }

  async findDeletedOne(id: string): Promise<ResponseDto<CompanyResponseDto>> {
    const company = await this.companyRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!company) {
      throw new NotFoundException('Empresa excluída não encontrada.');
    }

    return {
      data: {
        id: company.id,
        name: company.name,
        createdAt: company.createdAt,
      },
    };
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ResponseDto<CompanyResponseDto>> {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });
      if (!company) {
        throw new NotFoundException('Empresa não encontrada.');
      }

      const companyData = this.companyRepository.merge(
        company,
        updateCompanyDto,
      );
      const updateCompany = await this.companyRepository.save(companyData);
      return {
        data: {
          id: updateCompany.id,
          name: updateCompany.name,
          createdAt: updateCompany.createdAt,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Já existe uma empresa com esse nome!');
      }

      throw error;
    }
  }

  async softRemove(id: string): Promise<ResponseDto<CompanyResponseDto>> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    await this.companyRepository.softRemove(company);
    return {
      data: {
        id: company.id,
        name: company.name,
        createdAt: company.createdAt,
      },
    };
  }

  async recover(id: string): Promise<ResponseDto<CompanyResponseDto>> {
    const company = await this.companyRepository.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    if (!company.deletedAt) {
      throw new ConflictException('A empresa já está ativa.');
    }

    try {
      await this.companyRepository.recover(company);

      return {
        data: {
          id: company.id,
          name: company.name,
          createdAt: company.createdAt,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Não foi possível recuperar a empresa, pois já existe outra empresa ativa com esse nome.',
        );
      }

      throw error;
    }
  }
}
