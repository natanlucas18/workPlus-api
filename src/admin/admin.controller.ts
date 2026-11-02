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
import { CompaniesService } from 'src/company/companies.service';
import { UsersService } from 'src/users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enums/user-roles.enum';
import { AdminDashboardService } from './dashboard/admin-dashboard.service';
import { CreateCompanyDto } from 'src/company/dtos/create-company.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateCompanyDto } from 'src/company/dtos/update-company.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { UpdateUserDto } from 'src/users/dtos/update-user.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.SUPER_ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
    private readonly adminDashboardService: AdminDashboardService,
  ) {}

  @Get('dashboard')
  getDashboardOverview() {
    return this.adminDashboardService.getDashboardOverview();
  }

  @Post('companies')
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get('companies')
  findAllCompanies(@Query() query: PaginatedQueryDto) {
    return this.companiesService.findAll(query);
  }

  @Get('companies/deleted')
  findAllDeletedCompanies(@Query() query: PaginatedQueryDto) {
    return this.companiesService.findAllDeleted(query);
  }

  @Get('companies/:id')
  findOneCompany(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.companiesService.findOne(id);
  }

  @Get('companies/deleted/:id')
  findDeletedOneCompany(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.companiesService.findDeletedOne(id);
  }

  @Patch('companies/:id')
  updateCompany(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete('companies/:id')
  softDeleteCompany(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.companiesService.softRemove(id);
  }

  @Patch('companies/:id/recover')
  recoverCompany(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.companiesService.recover(id);
  }

  @Post('companies/:companyId/users')
  createUser(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto, companyId);
  }

  @Get('companies/:companyId/users')
  findAllUsers(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.usersService.findAll(query, companyId);
  }

  @Get('companies/:companyId/users/deleted')
  findAllDeletedUsers(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Query() query: PaginatedQueryDto,
  ) {
    return this.usersService.findAllDeleted(query, companyId);
  }

  @Get('companies/:companyId/users/:id')
  findOneUser(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.usersService.findOne(id, companyId);
  }

  @Get('companies/:companyId/users/deleted/:id')
  findDeletedOneUser(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.usersService.findDeletedOne(id, companyId);
  }

  @Patch('companies/:companyId/users/:id')
  updateUser(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto, companyId);
  }

  @Delete('companies/:companyId/users/:id')
  softDeleteUser(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.usersService.softRemove(id, companyId);
  }

  @Patch('companies/:companyId/users/:id/recover')
  recoverUser(
    @Param('companyId', new ParseUUIDPipe()) companyId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.usersService.recover(id, companyId);
  }
}
