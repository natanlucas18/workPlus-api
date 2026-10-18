import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigType } from '@nestjs/config';
import globalConfig from './global.config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
