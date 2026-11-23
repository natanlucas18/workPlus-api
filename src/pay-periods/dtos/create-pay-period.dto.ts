import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePayPeriodDto {
  @ApiProperty({
    example: 'Dezembro/2026',
    description: 'Nome do período de pagamento',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: '2026-11-20',
    description: 'Data de inicio do período de pagamento',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2026-12-20',
    description: 'Data de encerramento do período de pagamento',
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;
}
