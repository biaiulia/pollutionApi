import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExpoService } from './expo.service';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly expoService: ExpoService,
  ) {}

  async sendNotification(message: string, data: SensorReadingCreateDto) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { sensorId: data.sensorId },
      include: { user: true },
    });

    for (const subscription of subscriptions) {
      const token = subscription.user.expoNotificationsApiKey;

      await this.expoService.sendPushNotification(token, message, {
        sensorId: data.sensorId,
        aqiLevel: data.aqiLevel,
      });
    }
  }
}
