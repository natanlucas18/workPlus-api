import { EmployeeShift } from 'src/enums/employee-shift.enum';

export class EmployeeResponseDto {
  id: string;
  registration: number;
  name: string;
  dateOfBirth: Date;
  shift: EmployeeShift;
}
