import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayPeriod } from './entities/pay-period.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreatePayPeriodDto } from './dtos/create-pay-period.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { PayPeriodResponseDto } from './dtos/pay-period-response.dto';
import { PayPeriodStatus } from 'src/enums/pay-period-status.enum';
import { isUniqueViolation } from 'src/database/utils/is-unique-violation';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';

@Injectable()
export class PayPeriodsService {
  constructor(
    @InjectRepository(PayPeriod)
    private readonly payPeriodRepository: Repository<PayPeriod>,
  ) {}

  async create(
    createPayPeriodDto: CreatePayPeriodDto,
    companyId: string,
  ): Promise<ResponseDto<PayPeriodResponseDto>> {
    if (
      new Date(createPayPeriodDto.startDate) <
      new Date(createPayPeriodDto.endDate)
    ) {
      throw new BadRequestException(
        'A data final não pode ser anterior a data inicial.',
      );
    }

    try {
      const payPeriodData = this.payPeriodRepository.create({
        name: createPayPeriodDto.name.trim().normalize('NFC'),
        startDate: new Date(createPayPeriodDto.startDate),
        endDate: new Date(createPayPeriodDto.endDate),
        status: PayPeriodStatus.OPEN,
        company: { id: companyId },
      });

      const newPayPeriod = await this.payPeriodRepository.save(payPeriodData);

      return {
        data: {
          id: newPayPeriod.id,
          name: newPayPeriod.name,
          startDate: newPayPeriod.startDate,
          endDate: newPayPeriod.endDate,
          status: newPayPeriod.status,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Já existe um período de apuração aberto nessa mesma data.',
        );
      }

      throw error;
    }
  }

  async findAll(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<PayPeriod>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const qb = await this.payPeriodRepository
      .createQueryBuilder('pay-period')
      .where('pay_period.company.id = :companyId', { companyId });

    if (query.search) {
      qb.andWhere('pay_period.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const allowedSortBy = ['name', 'startDate', 'endDate', 'status'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`pay_period.${sortBy}`, sortOrder);

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

  async findOne(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<PayPeriodResponseDto>> {
    const payPeriod = await this.payPeriodRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
    });

    if (!payPeriod) {
      throw new NotFoundException('Período de apuração não encontrado.');
    }

    return {
      data: {
        id: payPeriod.id,
        name: payPeriod.name,
        startDate: payPeriod.startDate,
        endDate: payPeriod.endDate,
        status: payPeriod.status,
      },
    };
  }

  async closePeriod(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<PayPeriodResponseDto>> {
    const payPeriod = await this.payPeriodRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
    });

    if (!payPeriod) {
      throw new NotFoundException('Período de apuração não encontrado.');
    }

    if (payPeriod.status === PayPeriodStatus.CLOSED) {
      throw new ConflictException('Este período já está fechado.');
    }

    payPeriod.status = PayPeriodStatus.CLOSED;

    const closedPeriod = await this.payPeriodRepository.save(payPeriod);

    return {
      data: {
        id: closedPeriod.id,
        name: closedPeriod.name,
        startDate: closedPeriod.startDate,
        endDate: closedPeriod.endDate,
        status: closedPeriod.status,
      },
    };
  }

  async validateIfOpenForDate(
    recordDate: Date,
    companyId: string,
  ): Promise<void> {
    const targetData = new Date(recordDate);

    const period = await this.payPeriodRepository.findOne({
      where: {
        startDate: LessThanOrEqual(targetData),
        endDate: MoreThanOrEqual(targetData),
        company: { id: companyId },
      },
    });

    if (period && period.status === PayPeriodStatus.CLOSED) {
      throw new BadRequestException(
        `Não é permitido registrar ou alterar lançamentos. O período '${period.name}' está fechado.`,
      );
    }
  }
}
