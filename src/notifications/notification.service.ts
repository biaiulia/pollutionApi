import { Injectable } from '@nestjs/common';
import { ExpoService } from './expo.service';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { SubscriptionService } from 'src/subscriptions/subscription.service';
import { NotificationDal } from './notification.dal';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationDto } from 'src/dtos/create-notification-dto';

@Injectable()
export class NotificationService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly notificationDal: NotificationDal,
    private readonly expoService: ExpoService,
  ) {}

  async sendNotification(message: string, data: SensorReadingCreateDto) {
    const subscriptions =
      await this.subscriptionService.getUsersSubscribedToSensor(data.sensorId);

    for (const subscription of subscriptions) {
      const token = subscription.user.expoNotificationsApiKey;
      await this.createNotification({
        userId: subscription.userId,
        message,
        dateTime: new Date(),
        isRead: false,
      } as CreateNotificationDto);
      await this.expoService.sendPushNotification(token, message, {
        sensorId: data.sensorId,
        aqiLevel: data.aqiLevel,
      });
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notificationDal.findNotificationsByUserId(userId);
  }

  async createNotification(createNotification: CreateNotificationDto) {
    return this.notificationDal.createNotification(createNotification);
  }
}
