import { Activity } from 'src/activities/entities/activity.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { ExtraEarning } from 'src/extra-earnings/entities/extra-earnings.entity';
import { PayPeriod } from 'src/pay-periods/entities/pay-period.entity';
import { User } from 'src/users/entities/user.entity';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('companies')
@Index('idx_company_name', ['name'], { unique: true })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @CreateDateColumn()
  createdAt: Date | null;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => WorkStation, (workStation) => workStation.company)
  workStations: WorkStation[];

  @OneToMany(() => Activity, (activity) => activity.company)
  activities: Activity[];

  @OneToMany(() => PayPeriod, (payPeriod) => payPeriod.company)
  payPeriods: PayPeriod[];

  @OneToMany(() => ExtraEarning, (extraEarnings) => extraEarnings.company)
  extraEarnings: ExtraEarning[];
}
