import { Logger, Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModule } from 'src/notifications/notification.module';
import { SensorReadingModule } from 'src/sensor-reading/sensor-reading.module';

@Module({
  imports: [NotificationModule, SensorReadingModule],
  providers: [MqttService, PrismaService, Logger],
  exports: [MqttService],
})
export class MqttModule {}
