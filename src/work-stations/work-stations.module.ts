import { Module } from '@nestjs/common';
import { WorkStationsService } from './work-stations.service';
import { WorkStationsController } from './work-stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkStation } from './entities/work-station.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkStation]), AuthModule],
  controllers: [WorkStationsController],
  providers: [WorkStationsService],
})
export class WorkStationsModule {}
