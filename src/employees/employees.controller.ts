import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Roles('rh', 'manager', 'super_admin')
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

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Get()
  findAll(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.findAll(query, tokenPayloadDto.companyId);
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.findOne(id, tokenPayloadDto.companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
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

  @Roles('rh', 'manager', 'super_admin')
  @Delete(':id')
  remove(
    @Param(':id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.employeesService.remove(id, tokenPayloadDto.companyId);
  }
}
