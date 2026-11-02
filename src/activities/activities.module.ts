import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';
import { Company } from 'src/company/entities/company.entity';
import { CompanyContextGuard } from 'src/company-context/company-context.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, WorkStation, Company]),
    AuthModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService, CompanyContextGuard],
})
export class ActivitiesModule {}
