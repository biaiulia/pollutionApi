import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionDal {
  constructor(private prisma: PrismaService) {}

  async subscribe(userId: string, sensorId: string): Promise<Subscription> {
    return this.prisma.subscription.create({
      data: {
        userId,
        sensorId,
      },
    });
  }

  async unsubscribe(userId: string, sensorId: string): Promise<void> {
    await this.prisma.subscription.deleteMany({
      where: {
        userId,
        sensorId,
      },
    });
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { sensor: true },
    });
  }

  async getUsersSubscribedToSensor(sensorId: string) {
    return this.prisma.subscription.findMany({
      where: { sensorId: sensorId },
      include: { user: true },
    });
  }

  async isSubscribed(sensorId: string, userId: string): Promise<Subscription> {
    return this.prisma.subscription.findFirst({
      where: { userId, sensorId },
    });
  }
}
