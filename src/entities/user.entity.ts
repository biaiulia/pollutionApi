import { Subscription } from './subscription.entity';

export interface User {
  id: string;
  email: string;
  password?: string;
  role: string;
  isEmailVerified: boolean;
  expoNotificationsApiKey?: string;
  // subscriptions?: Subscription[];
  // notifications?: Notification[];
}
