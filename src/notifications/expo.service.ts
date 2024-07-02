import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class ExpoService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo();
  }

  //TODO: see with notifications
  async sendPushNotification(token: string, message: string, data?: any) {
    const messages: ExpoPushMessage[] = [
      {
        to: token,
        sound: 'default',
        body: message,
        data,
      },
    ];

    const chunks = this.expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }
  }
}
