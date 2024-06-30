import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubscriptionService } from './subscription.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('subscribe')
  async subscribe(@Request() req, @Body('sensorId') sensorId: string) {
    return this.subscriptionService.subscribe(req.user.userId, sensorId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('unsubscribe')
  async unsubscribe(@Request() req, @Body('sensorId') sensorId: string) {
    return this.subscriptionService.unsubscribe(req.user.userId, sensorId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('subscriptions')
  async getUserSubscriptions(@Request() req) {
    return this.subscriptionService.getUserSubscriptions(req.user.userId);
  }
}
