import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { EmployeeShift } from 'src/enums/employee-shift.enum';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 101,
    description: 'Número de registro do funcionário',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  registration: number;

  @ApiProperty({
    example: 'Marcos Ferreira',
    description: 'Nome do funcionário',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: '2001-10-21',
    description: 'Data de nascimento do funcionário',
  })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    example: 'Normal',
    description: 'Turno de trabalho do funcionário',
  })
  @IsEnum(EmployeeShift)
  shift: EmployeeShift;
}
