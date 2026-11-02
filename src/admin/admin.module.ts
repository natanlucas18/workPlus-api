import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminDashboardService } from './dashboard/admin-dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import { Activity } from 'src/activities/entities/activity.entity';
import { ExtraEarning } from 'src/extra-earnings/entities/extra-earnings.entity';
import { Company } from 'src/company/entities/company.entity';
import { AuthModule } from 'src/auth/auth.module';
import { CompaniesModule } from 'src/company/companies.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      User,
      Employee,
      WorkStation,
      Activity,
      ExtraEarning,
    ]),
    AuthModule,
    CompaniesModule,
    UsersModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminDashboardService],
})
export class AdminModule {}
