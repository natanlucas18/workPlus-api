import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { isUniqueViolation } from 'src/database/utils/is-unique-violation';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    companyId: string,
  ): Promise<ResponseDto<UserResponseDto>> {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );
      const userData = this.userRepository.create({
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
        role: createUserDto?.role,
        company: { id: companyId },
      });

      const newUser = await this.userRepository.save(userData);

      return {
        data: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          company: newUser.company,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Esse e-mail já está cadastrado.');
      }

      throw error;
    }
  }

  async findAll(
    query: PaginatedQueryDto,
    companyId: string,
  ): Promise<PaginatedResponseDto<User>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .where('user.company_id = :companyId', { companyId });

    if (query.search?.trim()) {
      qb.andWhere(`(user.name ILIKE :search OR user.email ILIKE :search)`, {
        search: `%${query.search.trim()}%`,
      });
    }

    const allowedSortBy = ['name', 'email'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`user.${sortBy}`, sortOrder);

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
  ): Promise<PaginatedResponseDto<User>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .withDeleted()
      .where('user.company_id = :companyId', { companyId })
      .andWhere('user.deleted_at IS NOT NULL');

    if (query.search?.trim()) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search)', {
        search: `%${query.search.trim()}%`,
      });
    }

    const allowedSortBy = ['name', 'email'];

    const sortBy =
      query.sortBy && allowedSortBy.includes(query.sortBy)
        ? query.sortBy
        : 'name';

    const sortOrder = query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    qb.orderBy(`user.${sortBy}`, sortOrder);

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
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.userRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    };
  }

  async findDeletedOne(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.userRepository.findOne({
      where: { id, company: { id: companyId } },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('Usuário excluído não encontrado.');
    }

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    companyId: string,
  ): Promise<ResponseDto<UserResponseDto>> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          company: { id: companyId },
        },
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
      }
      if (updateUserDto.name !== undefined) {
        user.name = updateUserDto.name;
      }

      if (updateUserDto.email !== undefined) {
        user.email = updateUserDto.email;
      }

      if (updateUserDto.role !== undefined) {
        user.role = updateUserDto.role;
      }

      if (updateUserDto.password !== undefined) {
        const passwordHash = await this.hashingService.hash(
          updateUserDto.password,
        );
        user.passwordHash = passwordHash;
      }

      const updateUser = await this.userRepository.save(user);

      return {
        data: {
          id: updateUser.id,
          name: updateUser.name,
          email: updateUser.email,
          role: updateUser.role,
          company: updateUser.company,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException('Esse e-mail já está cadastrado.');
      }

      throw error;
    }
  }

  async softRemove(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.userRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.userRepository.softRemove(user);

    return {
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company,
      },
    };
  }

  async recover(
    id: string,
    companyId: string,
  ): Promise<ResponseDto<UserResponseDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        company: { id: companyId },
      },
      withDeleted: true,
    });

    if (!user || !user.deletedAt) {
      throw new NotFoundException('Usuário excluído não encontrado.');
    }

    try {
      await this.userRepository.recover(user);

      return {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
        },
      };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(
          'Não foi possível recuperar esse usuário, pois já existe outro usuário ativo com esse e-mail.',
        );
      }

      throw error;
    }
  }
}
