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
import { ActivitiesService } from './activities.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateActivityDto } from './dtos/create-activity.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateActivityDto } from './dtos/update-activity.dto';
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
import { ActivityResponseDto } from './dtos/activity-response.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@ApiCookieAuth('accessToken')
@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @ApiOperation({ summary: 'Cria uma atividade' })
  @ApiResponse({
    status: 201,
    description: 'Atividade criada com sucesso.',
    type: ActivityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada nessa empresa.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Já existe uma atividade com esse nome nessa estação de trabalho.',
  })
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Post()
  create(
    @Body() createActivityDto: CreateActivityDto,
    @CompanyId() companyId: string,
  ) {
    return this.activitiesService.create(createActivityDto, companyId);
  }

  @ApiOperation({ summary: 'Retorna todas as atividades' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Atividades retornadas com sucesso.',
    type: ActivityResponseDto,
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
    return this.activitiesService.findAll(query, companyId);
  }

  @ApiOperation({ summary: 'Retorna todas as atividades deletadas.' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Atividades deletadas retornas com sucesso.',
    type: ActivityResponseDto,
    isArray: true,
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @CompanyId() companyId: string,
  ) {
    return this.activitiesService.findAllDeleted(query, companyId);
  }

  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @ApiOperation({ summary: 'Retorna uma atividade especifica pelo ID' })
  @ApiParam({ name: 'id', description: 'Id da atividade' })
  @ApiResponse({
    status: 200,
    description: 'Atividade retornada com sucesso.',
    type: ActivityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade não encontrada.',
  })
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.activitiesService.findOne(id, companyId);
  }

  @ApiOperation({
    summary: 'Retorna uma atividade especifica pelo ID excluida logicamente',
  })
  @ApiParam({ name: 'id', description: 'Id da atividade excluida' })
  @ApiResponse({
    status: 200,
    description: 'Atividade deletada retornada com sucesso.',
    type: ActivityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade excluida não encontrada.',
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.activitiesService.findDeletedOne(id, companyId);
  }

  @ApiOperation({ summary: 'Atualiza uma atividade existente' })
  @ApiParam({ name: 'id', description: 'Id da atividade' })
  @ApiResponse({
    status: 200,
    description: 'Atividade atualizada com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade não encontrada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Já existe uma atividade com esse nome nessa estação de trabalho.',
  })
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @CompanyId() companyId: string,
  ) {
    return this.activitiesService.update(id, updateActivityDto, companyId);
  }

  @ApiOperation({ summary: 'Exclui logicamente uma atividade pelo ID.' })
  @ApiParam({ name: 'id', description: 'Id da atividade' })
  @ApiResponse({
    status: 200,
    description: 'atividade excluida com sucesso.',
    type: ActivityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade não encontrada.',
  })
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
    return this.activitiesService.softRemove(id, companyId);
  }

  @ApiOperation({
    summary: 'Recupera uma atividade que foi excluida logicamente',
  })
  @ApiParam({ name: 'id', description: 'Id da atividade' })
  @ApiResponse({
    status: 200,
    description: 'Atividade recuperada com sucesso.',
    type: ActivityResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Atividade não encontrada.',
  })
  @ApiResponse({
    status: 409,
    description: 'A atividade já está ativa.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Não foi possível recuperar a atividade, pois já existe outra atividade ativa com esse nome nessa estação de trabalho.',
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.activitiesService.recover(id, companyId);
  }
}
