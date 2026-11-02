import { Module } from '@nestjs/common';
import { PayPeriodsService } from './pay-periods.service';
import { PayPeriodsController } from './pay-periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPeriod } from './entities/pay-period.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Company } from 'src/company/entities/company.entity';
import { CompanyContextGuard } from 'src/company-context/company-context.guard';

@Module({
  imports: [TypeOrmModule.forFeature([PayPeriod, Company]), AuthModule],
  controllers: [PayPeriodsController],
  providers: [PayPeriodsService, CompanyContextGuard],
})
export class PayPeriodsModule {}
