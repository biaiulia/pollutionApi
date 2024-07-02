import { Controller, Post, Delete, Get, Request, Param } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth('token')
@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('subscribe/:sensorId')
  async subscribe(@Request() req, @Param('sensorId') sensorId: string) {
    return this.subscriptionService.subscribe(req.user.userId, sensorId);
  }

  @Delete('unsubscribe/:sensorId')
  async unsubscribe(@Request() req, @Param('sensorId') sensorId: string) {
    return this.subscriptionService.unsubscribe(req.user.userId, sensorId);
  }

  @Get('subscribed-sensors')
  async getUserSubscriptions(@Request() req) {
    return this.subscriptionService.getUserSubscriptions(req.user.userId);
  }

  @Get(':sensorId')
  async getSensorSubscriptions(@Param('sensorId') sensorId: string) {
    return this.subscriptionService.getUsersSubscribedToSensor(sensorId);
  }

  @Get(':sensorId/user/:userId')
  async isUserSubscribedToSensor(
    @Param('sensorId') sensorId: string,
    @Param('userId') userId: string,
  ) {
    return this.subscriptionService.checkIfUserIsSubscribed(sensorId, userId);
  }
}
