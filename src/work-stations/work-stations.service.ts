import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkStation } from './entities/work-station.entity';
import { Repository } from 'typeorm';
import { CreateWorkStationDto } from './dtos/create-work-station.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { WorkStationResponseDto } from './dtos/work-station-response.dto';
import { isUniqueViolation } from 'src/database/utils/is-unique-violation';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { UpdateWorkStationDto } from './dtos/update-work-station.dto';

@Injectable()
export class WorkStationsService {
  constructor(
    @InjectRepository(WorkStation)
    private readonly workStationRepo: Repository<WorkStation>,
  ) {}

  async create(
    createWorkStationDto: CreateWorkStationDto,
    companyId: string,
  ): Promise<ResponseDto<WorkStationResponseDto>> {
    try {
      const workStationData = this.workStationRepo.create({
        name: createWorkStationDto.name,
        supervisor: createWorkStationDto.supervisor,
        company: { id: companyId },
      });

      const newWorkStation = await this.workStationRepo.save(workStationData);

      return {
        data: {
          id: newWorkStation.id,
          name: newWorkStation.name,
          supervisor: newWorkStation.supervisor,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Já existe uma estação de trabalho cadastrada com esse nome.',
        );
      }

      throw error;
    }
  }

  async findAll(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<WorkStation>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const qb = this.workStationRepo
      .createQueryBuilder('work_station')
      .where('work_station.company.id = :companyId', { companyId });

    if (query.search) {
      qb.andWhere('work_station.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const allowedSortBy = ['name', 'supervisor'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`work_station.${sortBy}`, sortOrder);
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
  ): Promise<ResponseDto<WorkStationResponseDto>> {
    const workStation = await this.workStationRepo.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!workStation) {
      throw new NotFoundException('Estação de trabalho não encontrada.');
    }

    return {
      data: {
        id: workStation.id,
        name: workStation.name,
        supervisor: workStation.supervisor,
      },
    };
  }

  async update(
    id: string,
    updateWorkStationDto: UpdateWorkStationDto,
    companyId: string,
  ): Promise<ResponseDto<WorkStationResponseDto>> {
    const workStation = await this.workStationRepo.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!workStation) {
      throw new NotFoundException('Estação de trabalho não encontrada.');
    }

    try {
      Object.assign(workStation, updateWorkStationDto);

      const updateWorkStation = await this.workStationRepo.save(workStation);

      return {
        data: {
          id: updateWorkStation.id,
          name: updateWorkStation.name,
          supervisor: updateWorkStation.supervisor,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Já existe uma estação de trabalho cadastrada com esse nome.',
        );
      }

      throw error;
    }
  }

  async remove(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<WorkStationResponseDto>> {
    const workStation = await this.workStationRepo.findOne({
      where: {
        id,
        company: { id: companyId },
      },
    });

    if (!workStation) {
      throw new NotFoundException('Estação de trabalho não encontrada.');
    }

    const removedWorkStation =
      await this.workStationRepo.softRemove(workStation);

    return {
      data: {
        id: removedWorkStation.id,
        name: removedWorkStation.name,
        supervisor: removedWorkStation.supervisor,
      },
    };
  }
}
