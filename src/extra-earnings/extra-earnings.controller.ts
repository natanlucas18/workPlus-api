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

@UseGuards(AuthGuard('jwt'), RolesGuard, CompanyContextGuard)
@Controller('extra-earnings')
export class ExtraEarningsController {
  constructor(private readonly extraEarningsService: ExtraEarningsService) {}

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

  @Roles(UserRoles.SUPER_ADMIN)
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.findAllDeleted(query, companyId);
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
    return this.extraEarningsService.findOne(id, companyId);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.findDeletedOne(id, companyId);
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
    @Body() updateExtraEarningDto: UpdateExtraEarningDto,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.update(
      id,
      updateExtraEarningDto,
      companyId,
    );
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
    return this.extraEarningsService.softRemove(id, companyId);
  }

  @Roles(UserRoles.SUPER_ADMIN)
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CompanyId() companyId: string,
  ) {
    return this.extraEarningsService.recover(id, companyId);
  }
}
