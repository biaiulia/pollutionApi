import { Module } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReadingController } from './sensor-reading.controller';
import { SensorReadingDal } from './sensor-reading.dal';
import { PrismaModule } from '../prisma/prisma.module';
import { AirlyModule } from '../airly/airly.module';
import { GlobalCacheModule } from 'src/redis/global-cache.module';
import { CachingService } from 'src/redis/caching.service';

// TODO: Delete Cahcing service, check if it works with global, change naming from global to cachingMOdule
@Module({
  imports: [PrismaModule, AirlyModule, GlobalCacheModule],
  controllers: [SensorReadingController],
  providers: [SensorReadingService, SensorReadingDal, CachingService],
  exports: [SensorReadingService],
})
export class SensorReadingModule {}
