import { InquiryProduct } from './inquiry-product';

export interface Inquiry {
  id?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  mobileNo?: string;
  phone?: string;
  address?: string;
  website?: string;
  countryName?: string;
  description?: string;
  cityName?: string;
  message?: string;
  cityId?: string;
  countryId?: string;
  createdDate?: Date;
  inquiryProducts?: InquiryProduct[];
  inquirySourceId: string;
  inquiryStatusId: string;
  assignTo?: string;
  inquiryStatus?: string;
  assignToName?: string;
  inquiryActivityCount?: number;
  inquiryAttachmentCount?: number;
  inquiryNoteCount?: number;
}
