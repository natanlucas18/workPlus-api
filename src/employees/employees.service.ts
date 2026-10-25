import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { isUniqueViolation } from 'src/database/utils/is-unique-violation';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(
    createEmployeeDto: CreateEmployeeDto,
    companyId: string,
  ): Promise<
    ResponseDto<
      Pick<Employee, 'id' | 'registration' | 'name' | 'dateOfBirth' | 'shift'>
    >
  > {
    try {
      const employeeData = this.employeeRepository.create({
        registration: createEmployeeDto.registration,
        name: createEmployeeDto.name,
        dateOfBirth: new Date(createEmployeeDto.dateOfBirth),
        shift: createEmployeeDto.shift,
        company: { id: companyId },
      });

      const newEmployee = await this.employeeRepository.save(employeeData);

      return {
        data: {
          id: newEmployee.id,
          registration: newEmployee.registration,
          name: newEmployee.name,
          dateOfBirth: newEmployee.dateOfBirth,
          shift: newEmployee.shift,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Funcionário já cadastrado.');
      }

      throw error;
    }
  }

  async findAll(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<Employee>> {
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(query.limit || 10)));
    const skip = (page - 1) * limit;

    const qb = this.employeeRepository
      .createQueryBuilder('employee')
      .where('employee.company.id = :companyId', { companyId });

    if (query.search) {
      qb.andWhere('employee.name ILIKE :search', {
        search: `%${query.search}%`,
      });
    }

    const allowedSortBy = ['registration', 'name', 'dateOfBirth', 'shift'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`employee.${sortBy}`, sortOrder);
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
        hasPreviousPage: totalPages > 1,
        hasNextPage: page < totalPages,
      },
    };
  }

  async findOne(
    id: string,
    companyId: string,
  ): Promise<
    ResponseDto<
      Pick<Employee, 'id' | 'registration' | 'name' | 'dateOfBirth' | 'shift'>
    >
  > {
    const employee = await this.employeeRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    return {
      data: {
        id: employee.id,
        registration: employee.registration,
        name: employee.name,
        dateOfBirth: employee.dateOfBirth,
        shift: employee.shift,
      },
    };
  }

  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
    companyId: string,
  ): Promise<
    ResponseDto<
      Pick<Employee, 'id' | 'registration' | 'name' | 'dateOfBirth' | 'shift'>
    >
  > {
    const employee = await this.employeeRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    try {
      Object.assign(employee, updateEmployeeDto);

      if (updateEmployeeDto.dateOfBirth) {
        employee.dateOfBirth = new Date(updateEmployeeDto.dateOfBirth);
      }

      const updateEmployee = await this.employeeRepository.save(employee);

      return {
        data: {
          id: updateEmployee.id,
          registration: updateEmployee.registration,
          name: updateEmployee.name,
          dateOfBirth: updateEmployee.dateOfBirth,
          shift: updateEmployee.shift,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Funcionário já cadastrado.');
      }

      throw error;
    }
  }

  async remove(
    id: string,
    companyId: string,
  ): Promise<
    ResponseDto<
      Pick<Employee, 'id' | 'registration' | 'name' | 'dateOfBirth' | 'shift'>
    >
  > {
    const employee = await this.employeeRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!employee) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const removedEmployee = await this.employeeRepository.softRemove(employee);
    return {
      data: {
        id: removedEmployee.id,
        registration: removedEmployee.registration,
        name: removedEmployee.name,
        dateOfBirth: removedEmployee.dateOfBirth,
        shift: removedEmployee.shift,
      },
    };
  }
}
