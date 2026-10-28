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
import { tokenPayloadParams } from 'src/auth/decorators/token-payload.decorator';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateActivityDto } from './dtos/update-activity.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Post()
  create(
    @Body() createActivityDto: CreateActivityDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.create(
      createActivityDto,
      tokenPayloadDto.companyId,
    );
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Get()
  findAll(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.findAll(query, tokenPayloadDto.companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
  @Get('deleted')
  findAllDeleted(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.findAllDeleted(
      query,
      tokenPayloadDto.companyId,
    );
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.findOne(id, tokenPayloadDto.companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
  @Get('deleted/:id')
  findDeletedOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.findDeletedOne(id, tokenPayloadDto.companyId);
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.update(
      id,
      updateActivityDto,
      tokenPayloadDto.companyId,
    );
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Delete(':id')
  softRemove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.softRemove(id, tokenPayloadDto.companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
  @Patch(':id/recover')
  recover(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.activitiesService.recover(id, tokenPayloadDto.companyId);
  }
}
