// subscription.service.ts
import { Injectable } from '@nestjs/common';
import { SubscriptionDal } from './subscription.dal';
import { Subscription } from '../entities/subscription.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SubscriptionService {
  constructor(private subscriptionDal: SubscriptionDal) {}

  async subscribe(userId: string, sensorId: string): Promise<Subscription> {
    return this.subscriptionDal.subscribe(userId, sensorId);
  }

  async unsubscribe(userId: string, sensorId: string): Promise<void> {
    await this.subscriptionDal.unsubscribe(userId, sensorId);
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionDal.getUserSubscriptions(userId);
  }

  async getUsersSubscribedToSensor(sensorId: string) {
    return this.subscriptionDal.getUsersSubscribedToSensor(sensorId);
  }

  // async updateUserExpoPushToken(
  //   userId: string,
  //   expoPushToken: string,
  // ): Promise<void> {
  //   await this.userDAL.updateExpoPushToken(userId, expoPushToken);
  // }
}
