import { Module } from '@nestjs/common';
import { ExtraEarningsService } from './extra-earnings.service';
import { ExtraEarningsController } from './extra-earnings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraEarning } from './entities/extra-earnings.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Company } from 'src/company/entities/company.entity';
import { CompanyContextGuard } from 'src/company-context/company-context.guard';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraEarning, Company]), AuthModule],
  controllers: [ExtraEarningsController],
  providers: [ExtraEarningsService, CompanyContextGuard],
})
export class ExtraEarningsModule {}
