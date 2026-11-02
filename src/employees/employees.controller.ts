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
import { CompanyContextGuard } from 'src/company-context/company-context.guard';
import { CompanyId } from 'src/company-context/company-id.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.create(createEmployeeDto, companyId);
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Get()
  findAll(@Query() query: PaginatedQueryDto, @CompanyId() companyId: string) {
    return this.employeesService.findAll(query, companyId);
  }

  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.findAllDeleted(query, companyId);
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
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.findOne(id, companyId);
  }

  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.findDeletedOne(id, companyId);
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
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.update(id, updateEmployeeDto, companyId);
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Delete(':id')
  softRemove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.softRemove(id, companyId);
  }

  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.recover(id, companyId);
  }
}
