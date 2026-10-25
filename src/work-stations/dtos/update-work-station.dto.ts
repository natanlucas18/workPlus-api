import { PartialType } from '@nestjs/swagger';
import { CreateWorkStationDto } from './create-work-station.dto';

export class UpdateWorkStationDto extends PartialType(CreateWorkStationDto) {}
