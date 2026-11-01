import { Company } from 'src/company/entities/company.entity';
import { UserRoles } from 'src/enums/user-roles.enum';
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

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.SUPERVISOR,
  })
  role: UserRoles;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Company, (company) => company.users, {
    eager: true,
  })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ExtraEarning, (extraEarnings) => extraEarnings.addedBy)
  extraEarnings: ExtraEarning[];

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
