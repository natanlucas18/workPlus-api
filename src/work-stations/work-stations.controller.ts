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
import { WorkStationsService } from './work-stations.service';
import { CreateWorkStationDto } from './dtos/create-work-station.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateWorkStationDto } from './dtos/update-work-station.dto';
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
import { WorkStationResponseDto } from './dtos/work-station-response.dto';

@ApiTags('work-stations')
@ApiCookieAuth('accessToken')
@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@Controller('work-stations')
export class WorkStationsController {
  constructor(private readonly workStationsService: WorkStationsService) {}

  @ApiOperation({ summary: 'Cria uma nova estação de trabalho' })
  @ApiResponse({
    status: 201,
    description: 'Estação de trabalho criada com sucesso.',
    type: WorkStationResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma estação de trabalho cadastrada com esse nome.',
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Post()
  create(
    @Body() createWorkStationDto: CreateWorkStationDto,
    @CompanyId() companyId: string,
  ) {
    return this.workStationsService.create(createWorkStationDto, companyId);
  }

  @ApiOperation({ summary: 'Retorna todas as estações de trabalho' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Estações de trabalho retornadas com sucesso.',
    type: WorkStationResponseDto,
    isArray: true,
  })
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  findAll(@Query() query: PaginatedQueryDto, @CompanyId() companyId: string) {
    return this.workStationsService.findAll(query, companyId);
  }

  @ApiOperation({ summary: 'Retorna todas as estações de trabalho deletadas' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Estações de trabalho excluídas retornadas com sucesso.',
    type: WorkStationResponseDto,
    isArray: true,
  })
  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @CompanyId() companyId: string,
  ) {
    return this.workStationsService.findAll(query, companyId);
  }

  @ApiOperation({
    summary: 'Retorna uma estação de trabalho específica pelo Id',
  })
  @ApiParam({ name: 'id', description: 'Id da estação de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Estação de trabalho retornada com sucesso.',
    type: WorkStationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
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
    return this.workStationsService.findOne(id, companyId);
  }

  @ApiOperation({
    summary: 'Retorna uma estação de trabalho excluída específica pelo Id',
  })
  @ApiParam({ name: 'id', description: 'Id da estação de trabalho excluída' })
  @ApiResponse({
    status: 200,
    description: 'Estação de trabalho excluída retornada com sucesso.',
    type: WorkStationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho excluída não encontrada.',
  })
  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get(':id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.workStationsService.findDeletedOne(id, companyId);
  }

  @ApiOperation({
    summary: 'Atualiza uma estação de trabalho existente',
  })
  @ApiParam({ name: 'id', description: 'Id da estação de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Estação de trabalho atualizada com sucesso.',
    type: WorkStationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe uma estação de trabalho cadastrada com esse nome.',
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWorkStationDto: UpdateWorkStationDto,
    @CompanyId() companyId: string,
  ) {
    return this.workStationsService.update(id, updateWorkStationDto, companyId);
  }

  @ApiOperation({ summary: 'Remove logicamente uma estação de trabalho' })
  @ApiParam({ name: 'id', description: 'Id da estação de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Estação de trabalho excluída com sucesso.',
    type: WorkStationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  softRemove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.workStationsService.softRemove(id, companyId);
  }

  @ApiOperation({
    summary: 'Recupera uma estação de trabalho que foi excluída logicamente',
  })
  @ApiParam({ name: 'id', description: 'Id da estação de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Estação de trabalho recuperada com sucesso.',
    type: WorkStationResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'A estação de trabalho já está ativa.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Não foi possível recuperar a estação de trabalho, pois já existe outra ativa com esse nome.',
  })
  @Roles(UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.workStationsService.recover(id, companyId);
  }
}
