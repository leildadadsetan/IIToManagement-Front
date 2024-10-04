import { ApplicationEnums } from "./application.enum";

export interface ReminderScheduler {
  id: string;
  subject: string;
  message: string;
  createdDate: Date
  referenceId?: string;
  applicationEnums?: ApplicationEnums;
  userName?: string;
}
