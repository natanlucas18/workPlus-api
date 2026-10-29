import { Module } from '@nestjs/common';
import { PayPeriodsService } from './pay-periods.service';
import { PayPeriodsController } from './pay-periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayPeriod } from './entities/pay-period.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PayPeriod]), AuthModule],
  controllers: [PayPeriodsController],
  providers: [PayPeriodsService],
})
export class PayPeriodsModule {}
