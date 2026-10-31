import { Company } from 'src/company/entities/company.entity';
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

@Entity('users')
@Index('idx_users_company_email', ['company', 'email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'supervisor' })
  role: 'supervisor' | 'rh' | 'manager' | 'super_admin';

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Company, (company) => company.users, {
    eager: true,
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ExtraEarning, (extraEarnings) => extraEarnings.addedBy)
  extraEarnings: ExtraEarning[];
}
