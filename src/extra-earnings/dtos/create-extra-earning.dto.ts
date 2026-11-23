import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426655440000',
    description: 'Id do funcionário',
  })
  @IsUUID()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({
    example: '231e7654-e98b-12d3-a456-426655330000',
    description: 'Id da estação de trabalho',
  })
  @IsUUID()
  @IsNotEmpty()
  workStationId: string;

  @ApiProperty({
    example: '46707d92-02f4-4817-8116-a4c3b23e6266',
    description: 'Id da atividade',
  })
  @IsUUID()
  @IsNotEmpty()
  activityId: string;

  @ApiPropertyOptional({
    example: 'Variedade da uva vitória',
    description: 'Descrição do lançamento',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: '72.00',
    description: 'Valor do lançamento',
  })
  @IsString()
  @Matches(/^\d+(\. \d{1,2})?$/)
  value: string;

  @ApiProperty({
    example: '2026-11-20',
    description: 'Data do lançamento',
  })
  @IsDateString()
  date: string;
}
