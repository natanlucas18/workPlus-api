import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraEarning } from './entities/extra-earnings.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { CreateExtraEarningDto } from './dtos/create-extra-earning.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ExtraEarningResponseDto } from './dtos/extra-earning-response.dto';
import { PayPeriod } from 'src/pay-periods/entities/pay-period.entity';
import { PayPeriodStatus } from 'src/enums/pay-period-status.enum';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { UpdateExtraEarningDto } from './dtos/update-extra-earning.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class ExtraEarningsService {
  constructor(
    @InjectRepository(ExtraEarning)
    private readonly extraEarningRepository: Repository<ExtraEarning>,

    private readonly dataSource: DataSource,
  ) {}

  async create(
    createExtraEarningDto: CreateExtraEarningDto,
    companyId: string,
    userId: string,
  ): Promise<ResponseDto<ExtraEarningResponseDto>> {
    return this.dataSource.transaction(async (manager) => {
      const payPeriod = await manager.findOne(PayPeriod, {
        where: {
          startDate: LessThanOrEqual(new Date(createExtraEarningDto.date)),
          endDate: MoreThanOrEqual(new Date(createExtraEarningDto.date)),
          company: { id: companyId },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!payPeriod) {
        throw new NotFoundException('Período de pagamento não encontrado.');
      }

      if (payPeriod.status === PayPeriodStatus.CLOSED) {
        throw new BadRequestException(
          'Não é possivel criar lançamentos em um período encerrado.',
        );
      }

      const workStation = await manager.findOne(WorkStation, {
        where: {
          id: createExtraEarningDto.workStationId,
          company: { id: companyId },
        },
      });

      if (!workStation) {
        throw new NotFoundException('Estação de trabalho não encontrada.');
      }

      const employee = await manager.findOne(Employee, {
        where: {
          id: createExtraEarningDto.employeeId,
          company: { id: companyId },
        },
      });

      if (!employee) {
        throw new NotFoundException('Funcionário não encontrado.');
      }

      const activity = await manager.findOne(Activity, {
        where: {
          id: createExtraEarningDto.activityId,
          workStation: { id: createExtraEarningDto.workStationId },
          company: { id: companyId },
        },
      });

      if (!activity) {
        throw new NotFoundException('Atividade não encontrada.');
      }

      const extraEarningData = manager.create(ExtraEarning, {
        description: createExtraEarningDto.description,
        value: createExtraEarningDto.value,
        date: new Date(createExtraEarningDto.date),
        workStation,
        employee,
        activity,
        company: { id: companyId },
        addedBy: { id: userId },
        payPeriod: { id: payPeriod.id },
      });

      const newExtraEarning = await manager.save(extraEarningData);

      return {
        data: {
          id: newExtraEarning.id,
          description: newExtraEarning.description ?? null,
          payPeriodName: payPeriod.name,
          workStationName: workStation.name,
          activityName: activity.name,
          employeeName: employee.name,
          value: newExtraEarning.value,
          date: newExtraEarning.date,
          addedBy: newExtraEarning.addedBy.name,
        },
      };
    });
  }

  async findAll(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<ExtraEarningResponseDto>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const sortColumns = {
      date: 'extra_earning.date',
      value: 'extra_earning.value',
      employeeName: 'employee.name',
      workStationName: 'workStation.name',
      activityName: 'activity.name',
      payPeriodName: 'payPeriod.name',
    };

    const sortBy =
      sortColumns[query.sortBy as keyof typeof sortColumns] ?? sortColumns.date;

    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.extraEarningRepository
      .createQueryBuilder('extra_earning')
      .leftJoinAndSelect('extra_earning.employee', 'employee')
      .leftJoinAndSelect('extra_earning.workStation', 'workStation')
      .leftJoinAndSelect('extra_earning.activity', 'activity')
      .leftJoinAndSelect('extra_earning.payPeriod', 'payPeriod')
      .leftJoinAndSelect('extra_earning.addedBy', 'addedBy')
      .where('extra_earning.company_id = :companyId', { companyId });

    if (query.search?.trim()) {
      qb.andWhere(
        `(
        employee.name ILIKE :search OR
        workStation.name ILIKE :search OR
        activity.name ILIKE :search OR
        extra_earning.description ILIKE :search OR
        TO_CHAR(extra_earning.date, 'YYYY-MM-DD') ILIKE :search
      )`,
        { search: `%${query.search.trim()}%` },
      );
    }

    qb.orderBy(sortBy, sortOrder).skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => ({
        id: item.id,
        description: item.description ?? null,
        payPeriodName: item.payPeriod.name,
        workStationName: item.workStation.name,
        activityName: item.activity.name,
        employeeName: item.employee.name,
        value: item.value,
        date: item.date,
        addedBy: item.addedBy.name,
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
    companyId: string,
  ): Promise<PaginatedResponseDto<ExtraEarningResponseDto>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const sortColumns = {
      date: 'extra_earning.date',
      value: 'extra_earning.value',
      employeeName: 'employee.name',
      workStationName: 'workStation.name',
      activityName: 'activity.name',
      payPeriodName: 'payPeriod.name',
    };

    const sortBy = sortColumns[query.sortBy] ?? sortColumns.date;

    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const qb = this.extraEarningRepository
      .createQueryBuilder('extra_earning')
      .withDeleted()
      .leftJoinAndSelect('extra_earning.employee', 'employee')
      .leftJoinAndSelect('extra_earning.workStation', 'workStation')
      .leftJoinAndSelect('extra_earning.activity', 'activity')
      .leftJoinAndSelect('extra_earning.payPeriod', 'payPeriod')
      .leftJoinAndSelect('extra_earning.addedBy', 'addedBy')
      .where('extra_earning.company_id = :companyId', { companyId })
      .andWhere('extra_earning.deleted_at IS NOT NULL');

    if (query.search?.trim()) {
      qb.andWhere(
        `(
        employee.name ILIKE :search OR
        workStation.name ILIKE :search OR
        activity.name ILIKE :search OR
        extra_earning.description ILIKE :search OR
        TO_CHAR(extra_earning.date, 'YYYY-MM-DD') ILIKE :search
      )`,
        { search: `%${query.search.trim()}%` },
      );
    }

    qb.orderBy(sortBy, sortOrder).skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data: data.map((item) => ({
        id: item.id,
        description: item.description ?? null,
        payPeriodName: item.payPeriod.name,
        workStationName: item.workStation.name,
        activityName: item.activity.name,
        employeeName: item.employee.name,
        value: item.value,
        date: item.date,
        addedBy: item.addedBy.name,
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

  async findOne(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ExtraEarningResponseDto>> {
    const extraEarning = await this.extraEarningRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      relations: {
        workStation: true,
        activity: true,
        addedBy: true,
        employee: true,
        payPeriod: true,
      },
    });

    if (!extraEarning) {
      throw new NotFoundException('Lançamento não encontrado.');
    }

    return {
      data: {
        id: extraEarning.id,
        description: extraEarning.description ?? null,
        payPeriodName: extraEarning.payPeriod.name,
        workStationName: extraEarning.workStation.name,
        activityName: extraEarning.activity.name,
        employeeName: extraEarning.employee.name,
        date: extraEarning.date,
        value: extraEarning.value,
        addedBy: extraEarning.addedBy.name,
      },
    };
  }

  async findDeletedOne(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ExtraEarningResponseDto>> {
    const extraEarning = await this.extraEarningRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      withDeleted: true,
      relations: {
        workStation: true,
        activity: true,
        addedBy: true,
        employee: true,
        payPeriod: true,
      },
    });

    if (!extraEarning || !extraEarning.deletedAt) {
      throw new NotFoundException('Lançamento excluído não encontrado.');
    }

    return {
      data: {
        id: extraEarning.id,
        description: extraEarning.description ?? null,
        payPeriodName: extraEarning.payPeriod.name,
        workStationName: extraEarning.workStation.name,
        activityName: extraEarning.activity.name,
        employeeName: extraEarning.employee.name,
        date: extraEarning.date,
        value: extraEarning.value,
        addedBy: extraEarning.addedBy.name,
      },
    };
  }

  async update(
    id: string,
    dto: UpdateExtraEarningDto,
    companyId: string,
  ): Promise<ResponseDto<ExtraEarningResponseDto>> {
    return this.dataSource.transaction(async (manager) => {
      const extraEarning = await manager.findOne(ExtraEarning, {
        where: {
          id,
          company: { id: companyId },
        },
        relations: {
          employee: true,
          workStation: true,
          activity: true,
          payPeriod: true,
          addedBy: true,
        },
      });

      if (!extraEarning) {
        throw new NotFoundException('Lançamento não encontrado.');
      }

      const employeeId = dto.employeeId ?? extraEarning.employee.id;
      const workStationId = dto.workStationId ?? extraEarning.workStation.id;
      const activityId = dto.activityId ?? extraEarning.activity.id;
      const date = dto.date ?? extraEarning.date;

      const payPeriod = await manager.findOne(PayPeriod, {
        where: {
          startDate: LessThanOrEqual(new Date(date)),
          endDate: MoreThanOrEqual(new Date(date)),
          company: { id: companyId },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!payPeriod) {
        throw new NotFoundException('Período de pagamento não encontrado.');
      }

      if (payPeriod.status === PayPeriodStatus.CLOSED) {
        throw new BadRequestException(
          'Não é possível atualizar lançamentos em um período encerrado.',
        );
      }

      if (dto.employeeId) {
        const employee = await manager.findOne(Employee, {
          where: {
            id: employeeId,
            company: { id: companyId },
          },
        });

        if (!employee) {
          throw new NotFoundException('Funcionário não encontrado.');
        }

        extraEarning.employee = employee;
      }

      if (dto.workStationId) {
        const workStation = await manager.findOne(WorkStation, {
          where: {
            id: workStationId,
            company: { id: companyId },
          },
        });

        if (!workStation) {
          throw new NotFoundException('Estação de trabalho não encontrada.');
        }

        extraEarning.workStation = workStation;
      }

      const activity = await manager.findOne(Activity, {
        where: {
          id: activityId,
          workStation: { id: workStationId },
          company: { id: companyId },
        },
      });

      if (!activity) {
        throw new NotFoundException('Atividade não encontrada.');
      }

      extraEarning.activity = activity;

      if (dto.description !== undefined) {
        extraEarning.description = dto.description;
      }

      if (dto.value !== undefined) {
        extraEarning.value = dto.value;
      }

      if (dto.date !== undefined) {
        extraEarning.date = new Date(dto.date);
      }

      extraEarning.payPeriod = payPeriod;

      const updatedExtraEarning = await manager.save(extraEarning);

      return {
        data: {
          id: updatedExtraEarning.id,
          description: updatedExtraEarning.description ?? null,
          payPeriodName: payPeriod.name,
          workStationName: updatedExtraEarning.workStation.name,
          activityName: updatedExtraEarning.activity.name,
          employeeName: updatedExtraEarning.employee.name,
          value: updatedExtraEarning.value,
          date: updatedExtraEarning.date,
          addedBy: updatedExtraEarning.addedBy.name,
        },
      };
    });
  }

  async softRemove(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ExtraEarningResponseDto>> {
    return this.dataSource.transaction(async (manager) => {
      const extraEarning = await manager.findOne(ExtraEarning, {
        where: {
          id,
          company: { id: companyId },
        },
        relations: {
          activity: true,
          addedBy: true,
          employee: true,
          payPeriod: true,
          workStation: true,
        },
      });

      if (!extraEarning) {
        throw new NotFoundException('Lançamento não encontrado.');
      }

      const payPeriod = await manager.findOne(PayPeriod, {
        where: {
          id: extraEarning.payPeriod.id,
          company: { id: companyId },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!payPeriod) {
        throw new NotFoundException('Período de pagamento não encontrado.');
      }

      if (payPeriod.status === PayPeriodStatus.CLOSED) {
        throw new BadRequestException(
          'Não é possivel excluir lançamentos em um período encerrado.',
        );
      }

      await manager.softRemove(extraEarning);

      return {
        data: {
          id: extraEarning.id,
          description: extraEarning.description ?? null,
          payPeriodName: payPeriod.name,
          workStationName: extraEarning.workStation.name,
          activityName: extraEarning.activity.name,
          employeeName: extraEarning.employee.name,
          date: extraEarning.date,
          value: extraEarning.value,
          addedBy: extraEarning.addedBy.name,
        },
      };
    });
  }

  async recover(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ExtraEarningResponseDto>> {
    return this.dataSource.transaction(async (manager) => {
      const extraEarning = await manager.findOne(ExtraEarning, {
        where: {
          id,
          company: { id: companyId },
        },
        withDeleted: true,
        relations: {
          activity: true,
          addedBy: true,
          employee: true,
          payPeriod: true,
          workStation: true,
        },
      });

      if (!extraEarning || !extraEarning.deletedAt) {
        throw new NotFoundException('Lançamento excluído não encontrado.');
      }

      const payPeriod = await manager.findOne(PayPeriod, {
        where: {
          id: extraEarning.payPeriod.id,
          company: { id: companyId },
        },
        lock: {
          mode: 'pessimistic_write',
        },
      });

      if (!payPeriod) {
        throw new NotFoundException('Período de pagamento não encontrado.');
      }

      if (payPeriod.status === PayPeriodStatus.CLOSED) {
        throw new BadRequestException(
          'Não é possível recuperar lançamentos de um período encerrado.',
        );
      }

      await manager.recover(extraEarning);

      return {
        data: {
          id: extraEarning.id,
          description: extraEarning.description ?? null,
          payPeriodName: payPeriod.name,
          workStationName: extraEarning.workStation.name,
          activityName: extraEarning.activity.name,
          employeeName: extraEarning.employee.name,
          date: extraEarning.date,
          value: extraEarning.value,
          addedBy: extraEarning.addedBy.name,
        },
      };
    });
  }
}
