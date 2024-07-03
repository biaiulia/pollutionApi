import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationController } from './notification.controller';
import { NotificationDal } from './notification.dal';
import { SubscriptionModule } from 'src/subscriptions/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationDal],
  exports: [NotificationService, NotificationDal],
})
export class NotificationModule {}
