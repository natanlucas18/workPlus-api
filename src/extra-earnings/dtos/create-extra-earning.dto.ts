import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateExtraEarningDto {
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @IsUUID()
  @IsNotEmpty()
  workStationId: string;

  @IsUUID()
  @IsNotEmpty()
  activityId: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsString()
  @Matches(/^\d+(\. \d{1,2})?$/)
  value: string;

  @IsDateString()
  date: string;
}
