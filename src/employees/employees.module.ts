import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Company } from 'src/company/entities/company.entity';
import { CompanyContextGuard } from 'src/company-context/company-context.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Company]), AuthModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, CompanyContextGuard],
})
export class EmployeesModule {}
