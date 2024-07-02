export interface Notification {
  id: string;
  userId: string;
  message: string;
  dateTime: Date;
  isRead: boolean;
}
