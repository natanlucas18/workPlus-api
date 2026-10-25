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
import { tokenPayloadParams } from 'src/auth/decorators/token-payload.decorator';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PaginatedQueryDto } from 'src/common/dtos/paginated-query.dto';
import { UpdateWorkStationDto } from './dtos/update-work-station.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('work-stations')
export class WorkStationsController {
  constructor(private readonly workStationsService: WorkStationsService) {}

  @Roles('rh', 'manager', 'super_admin')
  @Post()
  create(
    @Body() createWorkStationDto: CreateWorkStationDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.workStationsService.create(
      createWorkStationDto,
      tokenPayloadDto.companyId,
    );
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Get()
  findAll(
    @Query() query: PaginatedQueryDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.workStationsService.findAll(query, tokenPayloadDto.companyId);
  }

  @Roles('supervisor', 'rh', 'manager', 'super_admin')
  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.workStationsService.findOne(id, tokenPayloadDto.companyId);
  }

  @Roles('rh', 'manager', 'super_admin')
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateWorkStationDto: UpdateWorkStationDto,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.workStationsService.update(
      id,
      updateWorkStationDto,
      tokenPayloadDto.companyId,
    );
  }

  @Roles('rh', 'manager', 'super_admin')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @tokenPayloadParams() tokenPayloadDto: TokenPayloadDto,
  ) {
    return this.workStationsService.remove(id, tokenPayloadDto.companyId);
  }
}
