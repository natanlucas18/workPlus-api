import { Module } from '@nestjs/common';
import { WorkStationsService } from './work-stations.service';
import { WorkStationsController } from './work-stations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkStation } from './entities/work-station.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Company } from 'src/company/entities/company.entity';
import { CompanyContextGuard } from 'src/company-context/company-context.guard';

@Module({
  imports: [TypeOrmModule.forFeature([WorkStation, Company]), AuthModule],
  controllers: [WorkStationsController],
  providers: [WorkStationsService, CompanyContextGuard],
})
export class WorkStationsModule {}
