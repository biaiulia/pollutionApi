import { Module } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReadingController } from './sensor-reading.controller';
import { SensorReadingDal } from './sensor-reading.dal';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SensorReadingController],
  providers: [SensorReadingService, SensorReadingDal],
  exports: [SensorReadingService],
})
export class SensorReadingModule {}
