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
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { UserRoles } from 'src/enums/user-roles.enum';
import { CompanyContextGuard } from 'src/company-context/company-context.guard';
import { CompanyId } from 'src/company-context/company-id.decorator';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeeResponseDto } from './dtos/employee-response.dto';

@ApiTags('employees')
@ApiCookieAuth('accessToken')
@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOperation({ summary: 'Cria um novo funcionário' })
  @ApiResponse({
    status: 201,
    description: 'Funcionário cadastrado com sucesso!',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Funcionário já cadastrado' })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Post()
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.create(createEmployeeDto, companyId);
  }

  @ApiOperation({ summary: 'Retorna todos os funcionários' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Funcionários retornados com sucesso!',
    type: EmployeeResponseDto,
    isArray: true,
  })
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

  @ApiOperation({ summary: 'Retorna todos os funcionários deletados' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Funcionários deletados retornados com sucesso!',
    type: EmployeeResponseDto,
    isArray: true,
  })
  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.findAllDeleted(query, companyId);
  }

  @ApiOperation({ summary: 'Retorna um funcionário específico pelo Id' })
  @ApiParam({ name: 'id', description: 'Id do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário retornado com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
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

  @ApiOperation({ summary: 'Retorna um funcionário deletado' })
  @ApiParam({ name: 'id', description: 'Id do funcionário deletado' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário deletado retornado com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Funcionário excluído não encontrado.',
  })
  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.findDeletedOne(id, companyId);
  }

  @ApiOperation({ summary: 'Atualiza um funcionário existente' })
  @ApiParam({ name: 'id', description: 'Id do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário atualizado com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  @ApiResponse({ status: 409, description: 'Funcionário já cadastrado.' })
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

  @ApiOperation({ summary: 'Exclui logicamente um funcionário' })
  @ApiParam({ name: 'id', description: 'Id do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário excluído com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
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

  @ApiOperation({
    summary: 'Recupera um funcionário que foi excluído logicamente',
  })
  @ApiParam({ name: 'id', description: 'Id do funcionário' })
  @ApiResponse({
    status: 200,
    description: 'Funcionário recuperado com sucesso.',
    type: EmployeeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Funcionário excluído não encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Não foi possível recuperar o funcionário, pois já existe um funcionário com esse registro.',
  })
  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.employeesService.recover(id, companyId);
  }
}
