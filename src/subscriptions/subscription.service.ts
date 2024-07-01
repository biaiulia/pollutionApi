import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    // if (this.checkIfUserIsSubscribed(userId, sensorId)) {
    //   throw new BadRequestException(
    //     `User with id ${userId} already subscribed to the sensor with id ${sensorId}`,
    //   );
    // }
    const sensor = await this.getSensor(sensorId);
    return this.subscriptionDal.subscribe(userId, sensor.id);
  }

  async unsubscribe(userId: string, sensorId: string): Promise<void> {
    const sensor = await this.getSensor(sensorId);
    // if (!this.checkIfUserIsSubscribed(userId, sensorId)) {
    //   throw new BadRequestException(
    //     `User with id ${userId} is not subscribed to sensor with id ${sensorId}`,
    //   );
    // }
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

  async checkIfUserIsSubscribed(
    sensorId: string,
    userId: string,
  ): Promise<boolean> {
    console.log(this.subscriptionDal.isSubscribed(sensorId, userId));
    const subscription = await this.subscriptionDal.isSubscribed(
      sensorId,
      userId,
    );
    return !!subscription;
  }
}
