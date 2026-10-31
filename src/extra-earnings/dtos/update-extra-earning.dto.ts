import { PartialType } from '@nestjs/swagger';
import { CreateExtraEarningDto } from './create-extra-earning.dto';

export class UpdateExtraEarningDto extends PartialType(CreateExtraEarningDto) {}
