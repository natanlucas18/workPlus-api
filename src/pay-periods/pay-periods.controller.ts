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
import { tokenPayloadParams } from 'src/auth/decorators/token-payload.decorator';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('pay-periods')
export class PayPeriodsController {
  constructor(private readonly payPeriodsService: PayPeriodsService) {}

  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Post()
  create(
    @Body() createPayPeriodDto: CreatePayPeriodDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.payPeriodsService.create(
      createPayPeriodDto,
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
    return this.payPeriodsService.findAll(query, tokenPayloadDto.companyId);
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
    return this.payPeriodsService.findOne(id, tokenPayloadDto.companyId);
  }

  @Roles(UserRoles.RH, UserRoles.MANAGER, UserRoles.SUPER_ADMIN)
  @Patch(':id/close')
  close(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.payPeriodsService.closePeriod(id, tokenPayloadDto.companyId);
  }
}
