import { Company } from 'src/company/entities/company.entity';
import { EmployeeShift } from 'src/enums/employee-shift.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('employees')
@Index('idx_employees_company_registration', ['company', 'registration'], {
  unique: true,
})
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  registration: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({
    type: 'enum',
    enum: EmployeeShift,
    default: EmployeeShift.NORMAL,
  })
  shift: EmployeeShift;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleteAt: Date | null;

  @ManyToOne(() => Company, (company) => company.employees)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
