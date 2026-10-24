import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles('rh', 'manager', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    const companyId = tokenPayloadDto.companyId;
    return this.employeesService.create(createEmployeeDto, companyId);
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    const companyId = tokenPayloadDto.companyId;
    return this.employeesService.findAll(query, companyId);
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    const companyId = tokenPayloadDto.companyId;

    return this.employeesService.findOne(id, companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    const companyId = tokenPayloadDto.companyId;

    return this.employeesService.update(id, updateEmployeeDto, companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param(':id') id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    const companyId = tokenPayloadDto.companyId;

    return this.employeesService.remove(id, companyId);
  }
}
