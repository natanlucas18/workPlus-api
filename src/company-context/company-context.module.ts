import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyContextGuard } from './company-context.guard';
import { Company } from 'src/company/entities/company.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompanyContextGuard],
  exports: [CompanyContextGuard],
})
export class CompanyContextModule {}
