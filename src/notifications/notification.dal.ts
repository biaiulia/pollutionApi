import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class NotificationDal {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(data: any) {
    return this.prisma.notification.create({
      data,
    });
  }

  async findAllNotifications() {
    return this.prisma.notification.findMany();
  }

  async findNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
    });
  }
}
