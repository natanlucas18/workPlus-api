import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigType } from '@nestjs/config';
import globalConfig from './global.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from './company/companies.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { WorkStationsModule } from './work-stations/work-stations.module';
import { ActivitiesModule } from './activities/activities.module';
import { PayPeriodsModule } from './pay-periods/pay-periods.module';
import { ExtraEarningsModule } from './extra-earnings/extra-earnings.module';
import { AdminModule } from './admin/admin.module';
import { CompanyContextModule } from './company-context/company-context.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 10,
        blockDuration: 5000,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [globalConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [globalConfig.KEY],
      useFactory: (globalConfigurations: ConfigType<typeof globalConfig>) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          username: globalConfigurations.database.username,
          password: globalConfigurations.database.password,
          database: globalConfigurations.database.database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    CompaniesModule,
    UsersModule,
    AuthModule,
    EmployeesModule,
    CompanyContextModule,
    WorkStationsModule,
    ActivitiesModule,
    PayPeriodsModule,
    ExtraEarningsModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
