import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionDal } from './subscription.dal';
import { Subscription } from '../entities/subscription.entity';
import { SensorService } from 'src/sensors/sensor.service';

@Injectable()
export class SubscriptionService {
  constructor(
    private subscriptionDal: SubscriptionDal,
    private readonly sensorService: SensorService,
  ) {}

  async subscribe(userId: string, sensorId: string): Promise<Subscription> {
    const sensor = await this.getSensor(sensorId);

    return this.subscriptionDal.subscribe(userId, sensor.id);
  }

  async unsubscribe(userId: string, sensorId: string): Promise<void> {
    const sensor = await this.getSensor(sensorId);

    await this.subscriptionDal.unsubscribe(userId, sensor.id);
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.subscriptionDal.getUserSubscriptions(userId);
  }

  async getUsersSubscribedToSensor(sensorId: string) {
    const sensor = await this.getSensor(sensorId);
    return this.subscriptionDal.getUsersSubscribedToSensor(sensor.id);
  }

  async getSensor(sensorId: string) {
    const sensor = await this.sensorService.getSensor(sensorId);
    if (!sensor) {
      throw new NotFoundException();
    }
    return sensor;
  }

  // async updateUserExpoPushToken(
  //   userId: string,
  //   expoPushToken: string,
  // ): Promise<void> {
  //   await this.userDAL.updateExpoPushToken(userId, expoPushToken);
  // }
}
