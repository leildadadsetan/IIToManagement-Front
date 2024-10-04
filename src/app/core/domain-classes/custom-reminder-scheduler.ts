import { ApplicationEnums } from './application.enum';

export interface CustomReminderScheduler {
  subject: string;
  message: string;
  createdDate: Date;
  referenceId?: string;
  application?: ApplicationEnums;
  userIds: Array<string>;
  isEmailNotification: boolean;
}
