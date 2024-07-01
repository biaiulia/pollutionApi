import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModule } from 'src/notifications/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [MqttService, PrismaService],
  exports: [MqttService],
})
export class MqttModule {}
