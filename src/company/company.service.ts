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

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async findAll(
    query: PaginatedQueryDto,
  ): Promise<PaginatedResponseDto<Company>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb = this.companyRepository.createQueryBuilder('company');

    if (query.search) {
      qb.andWhere('(company.name ILIKE :search)', {
        search: `${query.search}%`,
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
      data,
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

  async findOne(id: string): Promise<ResponseDto<Company>> {
    const company = await this.companyRepository.findOne({ where: { id } });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    return {
      data: company,
    };
  }

  async create(
    createCompanyDto: CreateCompanyDto,
  ): Promise<ResponseDto<Pick<Company, 'name' | 'createdAt'>>> {
    try {
      const companyData = this.companyRepository.create({
        name: createCompanyDto.name,
      });

      const newCompany = await this.companyRepository.save(companyData);
      return {
        data: {
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

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<ResponseDto<Pick<Company, 'name' | 'createdAt'>>> {
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

  async remove(id: string): Promise<ResponseDto<Company>> {
    const company = await this.companyRepository.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Empresa não encontrada.');
    }

    const deleteCompany = await this.companyRepository.softRemove(company);
    return {
      data: deleteCompany,
    };
  }
}
