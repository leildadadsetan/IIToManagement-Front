import { User } from './user';

export interface InquiryNote {
  id?: string;
  inquiryId?: string;
  note?: string;
  createdBy?: string;
  createdByUser?: User;
  createdDate?: Date;
}
