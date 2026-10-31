import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { CreateExtraEarningDto } from './create-extra-earning.dto';

export class CreateExtraEarningsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => CreateExtraEarningDto)
  extraEarnings: CreateExtraEarningDto[];
}
