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
  @IsInt()
  @Min(1)
  registration: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsEnum(EmployeeShift)
  shift: EmployeeShift;
}
