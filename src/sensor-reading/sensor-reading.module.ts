import { Module } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReadingController } from './sensor-reading.controller';
import { SensorReadingDal } from './sensor-reading.dal';
import { PrismaModule } from '../prisma/prisma.module';
import { AirlyModule } from '../airly/airly.module';
import { SensorService } from 'src/sensors/sensor.service';
import { GlobalCacheModule } from 'src/redis/global-cache.module';
import { SensorDal } from 'src/sensors/sensor.dal';
import { CachingService } from 'src/redis/caching.service';

@Module({
  imports: [PrismaModule, AirlyModule, GlobalCacheModule],
  controllers: [SensorReadingController],
  providers: [
    SensorReadingService,
    SensorReadingDal,
    SensorService,
    SensorDal,
    CachingService,
  ],
  exports: [SensorReadingService],
})
export class SensorReadingModule {}
