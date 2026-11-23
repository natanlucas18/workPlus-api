import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateWorkStationDto {
  @ApiProperty({
    example: 'Peacking House',
    description: 'Nome da estação de trabalho',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Allan',
    description: 'Nome do supervisor da estação de trabalho',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  supervisor: string;
}
