import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PayPeriodsService } from './pay-periods.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from 'src/enums/user-roles.enum';
import { CreatePayPeriodDto } from './dtos/create-pay-period.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
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
import { PayPeriodResponseDto } from './dtos/pay-period-response.dto';

@ApiTags('pay-periods')
@ApiCookieAuth('accessToken')
@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@Controller('pay-periods')
export class PayPeriodsController {
  constructor(private readonly payPeriodsService: PayPeriodsService) {}

  @ApiOperation({ summary: 'Cria um novo período de pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Período de pagamento criado com sucesso.',
    type: PayPeriodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'A data final não pode ser anterior a data inicial.',
  })
  @ApiResponse({
    status: 409,
    description: 'Já existe um período de pagamento aberto nessa mesma data.',
  })
  @ApiResponse({
    status: 409,
    description:
      'O período de pagamento possui datas sobrepostas com outro período da empresa.',
  })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Post()
  create(
    @Body() createPayPeriodDto: CreatePayPeriodDto,
    @CompanyId() companyId: string,
  ) {
    return this.payPeriodsService.create(createPayPeriodDto, companyId);
  }

  @ApiOperation({ summary: 'Retorna todos os períodos de pagamento' })
  @ApiQuery(PaginatedQueryDto)
  @ApiResponse({
    status: 200,
    description: 'Períodos de pagamento retornados com sucesso.',
    type: PayPeriodResponseDto,
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
    return this.payPeriodsService.findAll(query, companyId);
  }

  @ApiOperation({ summary: 'Retorna um período de pagamento específico pelo' })
  @ApiParam({ name: 'id', description: 'Id do período de pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Período de pagamento retornado com sucesso.',
    type: PayPeriodResponseDto,
  })
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
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.payPeriodsService.findOne(id, companyId);
  }

  @ApiOperation({ summary: 'Fecha um período de pagamento' })
  @ApiParam({ name: 'id', description: 'Id do período de lançamento' })
  @ApiResponse({
    status: 200,
    description: 'Período de pagamento fechado com sucesso.',
    type: PayPeriodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Período de pagamento não encontrado.',
  })
  @ApiResponse({ status: 409, description: 'Este período já está fechado.' })
  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/close')
  close(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.payPeriodsService.closePeriod(id, companyId);
  }
}
