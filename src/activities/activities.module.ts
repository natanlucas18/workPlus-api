import { Module } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { AuthModule } from 'src/auth/auth.module';
import { WorkStation } from 'src/work-stations/entities/work-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, WorkStation]), AuthModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
