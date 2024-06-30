import { User } from './user.entity';

export interface Notification {
  id: string;
  userId: string;
  message: string;
  dateTime: Date;
  isRead: boolean;
  user: User;
}
