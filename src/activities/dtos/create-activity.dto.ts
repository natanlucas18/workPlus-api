import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateActivityDto {
  @ApiProperty({
    example: 'Desfolha',
    description: 'Nome da atividade',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example:
      'atividade onde é feita a retirada de folhas para que o fertilizante possa adentrar de forma mais eficaz na planta',
    description: 'descrição da atividade',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426655440000',
    description: 'ID da atividade',
  })
  @IsUUID()
  @IsNotEmpty()
  workStationId: string;
}
