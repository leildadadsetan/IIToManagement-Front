import { ResourceParameter } from "./resource-parameter";

export class InquiryResourceParameter extends ResourceParameter {
  companyName?: string;
  mobileNo?: string;
  phoneNo?: string;
  email?: string;
  contactPerson?: string;
  createdDate?: Date;
  city?: string;
  country?: string;
  assignTo?: string;
  inquiryStatusId?: string;
  inquirySourceId?: string;
}
