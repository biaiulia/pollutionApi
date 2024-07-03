import { Module, forwardRef } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { SensorReadingController } from './sensor-reading.controller';
import { SensorReadingDal } from './sensor-reading.dal';
import { PrismaModule } from '../prisma/prisma.module';
import { AirlyModule } from '../airly/airly.module';
import { CachingService } from 'src/redis/caching.service';
import { NotificationDal } from 'src/notifications/notification.dal';
import { NotificationService } from 'src/notifications/notification.service';
import { SubscriptionService } from 'src/subscriptions/subscription.service';
import { SubscriptionDal } from 'src/subscriptions/subscription.dal';
import { SensorService } from 'src/sensors/sensor.service';
import { SensorDal } from 'src/sensors/sensor.dal';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [PrismaModule, AirlyModule, forwardRef(() => NotificationModule)],
  controllers: [SensorReadingController],
  providers: [
    SensorReadingService,
    SensorReadingDal,
    SensorService,
    SensorDal,
    CachingService,
    NotificationService,
    NotificationDal,
    SubscriptionService,
    SubscriptionDal,
    CachingService,
  ],
  exports: [SensorReadingService],
})
export class SensorReadingModule {}
