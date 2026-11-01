import { Activity } from 'src/activities/entities/activity.entity';
import { Company } from 'src/company/entities/company.entity';
import { ExtraEarning } from 'src/extra-earnings/entities/extra-earnings.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('work_stations')
@Index('idx_work_stations_company_name', ['company', 'name'], {
  unique: true,
})
export class WorkStation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  supervisor: string;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Company, (company) => company.workStations)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Activity, (activity) => activity.workStation)
  activities: Activity[];

  @OneToMany(() => ExtraEarning, (extraEarnings) => extraEarnings.workStation)
  extraEarnings: ExtraEarning[];
}
