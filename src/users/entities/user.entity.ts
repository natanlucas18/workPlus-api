import { Company } from 'src/company/entities/company.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
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
}
