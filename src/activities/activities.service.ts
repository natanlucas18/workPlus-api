import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ActivityResponseDto } from './dtos/activity-response.dto';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import { isUniqueViolation } from 'src/database/utils/is-unique-violation';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { UpdateActivityDto } from './dtos/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(WorkStation)
    private readonly workStationRepository: Repository<WorkStation>,
  ) {}

  async create(
    createActivityDto: CreateActivityDto,
    companyId: string,
  ): Promise<ResponseDto<ActivityResponseDto>> {
    const workStation = await this.workStationRepository.findOne({
      where: {
        id: createActivityDto.workStationId,
        company: { id: companyId },
      },
    });

    if (!workStation) {
      throw new NotFoundException(
        'Estação de trabalho não encontrada nessa empresa.',
      );
    }

    try {
      const activityData = this.activityRepository.create({
        name: createActivityDto.name.trim().normalize('NFC'),
        description: createActivityDto.description,
        workStation,
        company: { id: companyId },
      });

      const newActivity = await this.activityRepository.save(activityData);

      return {
        data: {
          id: newActivity.id,
          name: newActivity.name,
          description: newActivity.description,
          createdAt: newActivity.createdAt,
          workStationName: newActivity.workStation.name,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Já existe uma atividade com esse nome nessa estação de trabalho.',
        );
      }

      throw error;
    }
  }

  async findAll(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<Activity>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const qb = this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.company.id = :companyId', { companyId });

    if (query.search) {
      qb.andWhere('activity.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const allowedSortBy = [
      'name',
      'description',
      'createdAt',
      'workStationName',
    ];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`activity.${sortBy}`, sortOrder);
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

  async findAllDeleted(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<Activity>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const qb = this.activityRepository
      .createQueryBuilder('activity')
      .withDeleted()
      .where('activity.company.id = :companyId', { companyId })
      .andWhere('activity.deleted_at IS NOT NULL');

    if (query.search) {
      qb.andWhere('activity.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const allowedSortBy = [
      'name',
      'description',
      'createdAt',
      'workStationName',
    ];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`activity.${sortBy}`, sortOrder);
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
  ): Promise<ResponseDto<ActivityResponseDto>> {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    return {
      data: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        createdAt: activity.createdAt,
        workStationName: activity.workStation.name,
      },
    };
  }

  async findDeletedOne(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ActivityResponseDto>> {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      withDeleted: true,
      relations: {
        workStation: true,
      },
    });

    if (!activity || !activity.deletedAt) {
      throw new NotFoundException('Atividade excluída não encontrada.');
    }

    return {
      data: {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        createdAt: activity.createdAt,
        workStationName: activity.workStation.name,
      },
    };
  }

  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
    companyId: string,
  ): Promise<ResponseDto<ActivityResponseDto>> {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      relations: {
        workStation: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    let workStation = activity.workStation;

    if (updateActivityDto.workStationId !== undefined) {
      const foundWorkStation = await this.workStationRepository.findOne({
        where: {
          id: updateActivityDto.workStationId,
          company: { id: companyId },
        },
      });

      if (!foundWorkStation) {
        throw new NotFoundException(
          'Estação de trabalho não encontrada nessa empresa.',
        );
      }

      workStation = foundWorkStation;
    }

    try {
      if (updateActivityDto.name !== undefined) {
        activity.name = updateActivityDto.name.trim().normalize('NFC');
      }

      if (updateActivityDto.description !== undefined) {
        activity.description = updateActivityDto.description;
      }

      activity.workStation = workStation;

      const updateActivity = await this.activityRepository.save(activity);

      return {
        data: {
          id: updateActivity.id,
          name: updateActivity.name,
          description: updateActivity.description,
          createdAt: updateActivity.createdAt,
          workStationName: updateActivity.workStation.name,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Já existe uma atividade com esse nome nessa estação de trabalho.',
        );
      }

      throw error;
    }
  }

  async softRemove(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ActivityResponseDto>> {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      relations: {
        workStation: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    const softRemovedActivity =
      await this.activityRepository.softRemove(activity);

    return {
      data: {
        id: softRemovedActivity.id,
        name: softRemovedActivity.name,
        description: softRemovedActivity.description,
        createdAt: softRemovedActivity.createdAt,
        workStationName: activity.workStation.name,
      },
    };
  }

  async recover(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<ActivityResponseDto>> {
    const activity = await this.activityRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      withDeleted: true,
      relations: {
        workStation: true,
      },
    });

    if (!activity) {
      throw new NotFoundException('Atividade não encontrada.');
    }

    if (!activity.deletedAt) {
      throw new ConflictException('A atividade já está ativa.');
    }

    try {
      await this.activityRepository.recover(activity);

      return {
        data: {
          id: activity.id,
          name: activity.name,
          description: activity.description,
          createdAt: activity.createdAt,
          workStationName: activity.workStation.name,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Não foi possível recuperar a atividade, pois já existe outra atividade ativa com esse nome nessa estação de trabalho.',
        );
      }

      throw error;
    }
  }
}
