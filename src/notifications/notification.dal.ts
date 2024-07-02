import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Notification } from 'src/entities/notification.entity';
import { CreateNotificationDto } from 'src/dtos/create-notification-dto';

@Injectable()
export class NotificationDal {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(notification: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: notification as Notification,
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
