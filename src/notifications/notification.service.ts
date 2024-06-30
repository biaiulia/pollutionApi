import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ExpoService } from './expo.service';

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private expoService: ExpoService,
  ) {}

  async sendNotification(data: any) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { sensorId: data.sensorId },
      include: { user: true },
    });

    for (const subscription of subscriptions) {
      const token = subscription.user.expoNotificationsApiKey;
      const message = `New reading for sensor ${data.sensorId}: ${data.reading}`;
      await this.expoService.sendPushNotification(token, message, {
        withSome: 'data',
      });
    }
  }
}
