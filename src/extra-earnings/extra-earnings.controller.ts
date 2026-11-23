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
import { ExtraEarningsService } from './extra-earnings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enums/user-roles.enum';
import { CreateExtraEarningDto } from './dtos/create-extra-earning.dto';
import { tokenPayloadParams } from 'src/auth/decorators/token-payload.decorator';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateExtraEarningDto } from './dtos/update-extra-earning.dto';
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
import { ExtraEarningResponseDto } from './dtos/extra-earning-response.dto';

@ApiTags('extra-earnings')
@ApiCookieAuth('accessToken')
@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@Controller('extra-earnings')
export class ExtraEarningsController {
  constructor(private readonly extraEarningsService: ExtraEarningsService) {}

  @ApiOperation({ summary: 'Cria um novo lançamento' })
  @ApiResponse({
    status: 201,
    description: 'Lançamento criado com sucesso.',
    type: ExtraEarningResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possivel criar lançamentos em um período encerrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Período de pagamento não encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  @ApiResponse({ status: 404, description: 'Atividade não encontrada.' })
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Post()
  create(
    @Body() createExtraEarningDto: CreateExtraEarningDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.create(
      createExtraEarningDto,
      companyId,
      tokenPayloadDto.sub,
    );
  }

  @ApiOperation({ summary: 'Retorna todos os lançamentos' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Lançamentos retornados com sucesso.',
    type: ExtraEarningResponseDto,
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
    return this.extraEarningsService.findAll(query, companyId);
  }

  @ApiOperation({ summary: 'Retorna todos os lançamentos deletados' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Lançamentos deletados retornados com sucesso.',
    type: ExtraEarningResponseDto,
    isArray: true,
  })
  @Roles(UserRoles.SUPER_ADMIN)
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.findAllDeleted(query, companyId);
  }

  @ApiOperation({ summary: 'Retorna um lançamento específico pelo Id' })
  @ApiParam({ name: 'id', description: 'Id do lançamento' })
  @ApiResponse({
    status: 200,
    description: 'Lançamento retornado com sucesso.',
    type: ExtraEarningResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Lançamento não encontrado.' })
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
    return this.extraEarningsService.findOne(id, companyId);
  }

  @ApiOperation({
    summary: 'Retorna um lançamento excluído específico pelo Id',
  })
  @ApiParam({ name: 'id', description: 'Id do lançamento' })
  @ApiResponse({
    status: 200,
    description: 'Lançamento excluído retornado com sucesso.',
    type: ExtraEarningResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Lançamento excluído não encontrado.',
  })
  @Roles(UserRoles.SUPER_ADMIN)
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.findDeletedOne(id, companyId);
  }

  @ApiOperation({ summary: 'Atualiza um lançamento existente' })
  @ApiParam({ name: 'id', description: 'Id do lançamento' })
  @ApiResponse({
    status: 200,
    description: 'Lançamento atualizado com sucesso.',
    type: ExtraEarningResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível atualizar lançamentos em um período encerrado.',
  })
  @ApiResponse({ status: 404, description: 'Lançamento não encontrado.' })
  @ApiResponse({
    status: 404,
    description: 'Período de pagamento não encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Estação de trabalho não encontrada.',
  })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  @ApiResponse({ status: 404, description: 'Atividade não encontrada.' })
  @Roles(
    UserRoles.SUPERVISOR,
    UserRoles.RH,
    UserRoles.MANAGER,
    UserRoles.SUPER_ADMIN,
  )
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateExtraEarningDto: UpdateExtraEarningDto,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.update(
      id,
      updateExtraEarningDto,
      companyId,
    );
  }

  @ApiOperation({ summary: 'Remove logicamente um lançamento' })
  @ApiParam({ name: 'id', description: 'Id do lançamento' })
  @ApiResponse({
    status: 200,
    description: 'Lançamento removido com sucesso.',
    type: ExtraEarningResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Não é possivel excluir lançamentos em um período encerrado.',
  })
  @ApiResponse({ status: 404, description: 'Lançamento não encontrado.' })
  @ApiResponse({
    status: 404,
    description: 'Período de pagamento não encontrado.',
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
    return this.extraEarningsService.softRemove(id, companyId);
  }

  @ApiOperation({
    summary: 'Recupera um lançamento que foi excluído logicamente',
  })
  @ApiParam({ name: 'id', description: 'Id do lançamento excluído' })
  @ApiResponse({
    status: 200,
    description: 'Lançamento recuperado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível recuperar lançamentos de um período encerrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Lançamento excluído não encontrado.',
  })
  @ApiResponse({
    status: 404,
    description: 'Período de pagamento não encontrado.',
  })
  @Roles(UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.recover(id, companyId);
  }
}
