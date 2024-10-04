import { User } from './user';

export interface InquiryAttachment {
  id?: string;
  inquiryId: string;
  documents?: string;
  name: string;
  createdByUser?: User;
  createdDate?: Date;
  extension?: string;
}
