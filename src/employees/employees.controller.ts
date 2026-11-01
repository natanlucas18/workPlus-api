import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { EmployeesService } from './employees.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { tokenPayloadParams } from 'src/auth/decorators/token-payload.decorator';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { UserRoles } from 'src/enums/user-roles.enum';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.create(
      createEmployeeDto,
      tokenPayloadDto.companyId,
    );
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Get()
  findAll(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.findAll(query, tokenPayloadDto.companyId);
  }

  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.findAll(query, tokenPayloadDto.companyId);
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.findOne(id, tokenPayloadDto.companyId);
  }

  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.findOne(id, tokenPayloadDto.companyId);
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.update(
      id,
      updateEmployeeDto,
      tokenPayloadDto.companyId,
    );
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Delete(':id')
  softRemove(
    @Param(':id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.softRemove(id, tokenPayloadDto.companyId);
  }

  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.recover(id, tokenPayloadDto.companyId);
  }
}
