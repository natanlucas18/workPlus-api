import { Module } from '@nestjs/common';
import { ExtraEarningsService } from './extra-earnings.service';
import { ExtraEarningsController } from './extra-earnings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtraEarning } from './entities/extra-earnings.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExtraEarning]), AuthModule],
  controllers: [ExtraEarningsController],
  providers: [ExtraEarningsService],
})
export class ExtraEarningsModule {}
