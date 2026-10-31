import { Activity } from 'src/activities/entities/activity.entity';
import { Company } from 'src/company/entities/company.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { PayPeriod } from 'src/pay-periods/entities/pay-period.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('extra_earnings')
@Index('idx_extra_earnings_company_date_employee', [
  'company',
  'date',
  'employee',
])
export class ExtraEarning {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WorkStation, (workStation) => workStation.extraEarnings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'work_station_id' })
  workStation: WorkStation;

  @ManyToOne(() => Activity, (activity) => activity.extraEarnings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @ManyToOne(() => PayPeriod, (payPeriod) => payPeriod.extraEarnings, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'pay_period_id' })
  payPeriod: PayPeriod;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Employee, (employee) => employee.extraEarnings)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: string;

  @Column({ type: 'date' })
  date: Date;

  @ManyToOne(() => User, (user) => user.extraEarnings)
  @JoinColumn({ name: 'user_id' })
  addedBy: User;

  @ManyToOne(() => Company, (company) => company.extraEarnings)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
