import { Company } from 'src/company/entities/company.entity';
import { ExtraEarning } from 'src/extra-earnings/entities/extra-earnings.entity';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activities')
@Index(
  'idx_activities_work_station_company_name',
  ['company', 'workStation', 'name'],
  {
    unique: true,
    where: '"deleted_at" IS NULL',
  },
)
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => WorkStation, (workStation) => workStation.activities, {
    nullable: false,
  })
  @JoinColumn({ name: 'work_station_id' })
  workStation: WorkStation;

  @ManyToOne(() => Company, (company) => company.activities, {
    nullable: false,
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ExtraEarning, (extraEarnings) => extraEarnings.activity)
  extraEarnings: ExtraEarning[];
}
