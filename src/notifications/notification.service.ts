import { Injectable } from '@nestjs/common';
import { ExpoService } from './expo.service';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { SubscriptionService } from 'src/subscriptions/subscription.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly expoService: ExpoService,
  ) {}

  async sendNotification(message: string, data: SensorReadingCreateDto) {
    const subscriptions =
      await this.subscriptionService.getUsersSubscribedToSensor(data.sensorId);

    for (const subscription of subscriptions) {
      const token = subscription.user.expoNotificationsApiKey;

      await this.expoService.sendPushNotification(token, message, {
        sensorId: data.sensorId,
        aqiLevel: data.aqiLevel,
      });
    }
  }
}
