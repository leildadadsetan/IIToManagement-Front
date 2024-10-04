import { User } from './user';

export interface InquiryTask {
  id?: string;
  subject: string;
  description: string;
  dueDate: Date;
  isOpen: boolean;
  assignTo?: string;
  assignToName?: string;
  priority: string;
  inquiryId: string;
  assignUser?: User;
}
