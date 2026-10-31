import { Company } from 'src/company/entities/company.entity';
import { PayPeriodStatus } from 'src/enums/pay-period-status.enum';
import { ExtraEarning } from 'src/extra-earnings/entities/extra-earnings.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pay_periods')
@Index('idx_pay_periods_company_name', ['company', 'startDate', 'endDate'], {
  unique: true,
})
export class PayPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PayPeriodStatus,
    default: PayPeriodStatus.OPEN,
  })
  status: PayPeriodStatus;

  @ManyToOne(() => Company, (company) => company.payPeriods)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ExtraEarning, (extraEarnings) => extraEarnings.payPeriod)
  extraEarnings: ExtraEarning[];
}
