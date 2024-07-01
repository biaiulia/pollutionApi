import { IsString } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  userId: string;
}
