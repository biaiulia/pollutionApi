import { Controller, Request, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth('token')
@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Request() req) {
    return this.notificationService.getNotifications(req.user.userId);
  }
}
