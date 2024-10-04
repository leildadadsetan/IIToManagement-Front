import { ResourceParameter } from "./resource-parameter";
export class CustomerResourceParameter extends ResourceParameter {
  id?: string = '';
  customerName: string = '';
  mobileNo: string = '';
  phoneNo: string = '';
  email: string = '';
  contactPerson: string = '';
  website: string = '';
}
