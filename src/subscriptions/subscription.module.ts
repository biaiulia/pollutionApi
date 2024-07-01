import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionDal } from './subscription.dal';
import { PrismaModule } from '../prisma/prisma.module';
import { SensorModule } from 'src/sensors/sensor.module';

@Module({
  imports: [PrismaModule, SensorModule],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionDal],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
