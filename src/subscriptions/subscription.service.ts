// subscription.service.ts
import { Injectable } from '@nestjs/common';
import { SubscriptionDal } from './subscription.dal';
import { Subscription } from '../entities/subscription.entity';
import { UserDal } from '../user/user.dal';

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionDAL: SubscriptionDal,
    private userDAL: UserDal,
  ) {}

  async subscribe(userId: string, sensorId: string): Promise<Subscription> {
    return this.subscriptionDAL.subscribe(userId, sensorId);
  }

  async unsubscribe(userId: string, sensorId: string): Promise<void> {
    await this.subscriptionDAL.unsubscribe(userId, sensorId);
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionDAL.getUserSubscriptions(userId);
  }

  // async updateUserExpoPushToken(
  //   userId: string,
  //   expoPushToken: string,
  // ): Promise<void> {
  //   await this.userDAL.updateExpoPushToken(userId, expoPushToken);
  // }
}
