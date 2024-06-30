import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class NotificationService {
  private expo: Expo;

  constructor(private prisma: PrismaService) {
    this.expo = new Expo();
  }

  async sendNotification(data: any) {
    const subscriptions = await this.prisma.subscription.findMany({
      where: { sensorId: data.sensorId },
      include: { user: true },
    });

    const messages: ExpoPushMessage[] = subscriptions.map((subscription) => ({
      to: subscription.user.expoNotificationsApiKey,
      sound: 'default',
      body: `New reading for sensor ${data.sensorId}: ${data.reading}`,
      data: { withSome: 'data' },
    }));

    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
