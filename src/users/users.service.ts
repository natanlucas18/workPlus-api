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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findAll(query: PaginatedQueryDto): Promise<PaginatedResponseDto<User>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const qb = this.userRepository.createQueryBuilder('user');

    if (query.search) {
      qb.andWhere('(user.name ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    const allowedSortBy = ['name', 'email', 'company'];

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
  ): Promise<
    ResponseDto<Pick<User, 'id' | 'name' | 'email' | 'role' | 'company'>>
  > {
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

  async create(
    createUserDto: CreateUserDto,
    companyId: string,
  ): Promise<
    ResponseDto<Pick<User, 'id' | 'name' | 'email' | 'role' | 'company'>>
  > {
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

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<
    ResponseDto<Pick<User, 'id' | 'name' | 'email' | 'role' | 'company'>>
  > {
    try {
      const userData = {
        name: updateUserDto?.name,
        email: updateUserDto?.email,
        role: updateUserDto?.role,
      };

      if (updateUserDto?.password) {
        const passwordHash = await this.hashingService.hash(
          updateUserDto.password,
        );
        userData['passwordHash'] = passwordHash;
      }

      const user = await this.userRepository.preload({
        id,
        ...userData,
      });

      if (!user) {
        throw new NotFoundException('Usuário não encontrado.');
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

  async remove(
    id: string,
    companyId: string,
  ): Promise<
    ResponseDto<Pick<User, 'id' | 'name' | 'email' | 'role' | 'company'>>
  > {
    const user = await this.userRepository.findOne({
      where: { id, company: { id: companyId } },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const removedUser = await this.userRepository.remove(user);

    return {
      data: {
        id: removedUser.id,
        name: removedUser.name,
        email: removedUser.email,
        role: removedUser.role,
        company: removedUser.company,
      },
    };
  }
}
