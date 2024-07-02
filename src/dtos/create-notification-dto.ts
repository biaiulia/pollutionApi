import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId: string;

  @IsString()
  message: string;

  @IsBoolean()
  isRead?: boolean = false;

  @IsDateString()
  dateTime: Date = new Date();
}
