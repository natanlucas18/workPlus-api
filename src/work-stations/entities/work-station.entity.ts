import { Company } from 'src/company/entities/company.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Company, (company) => company.workStations)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
