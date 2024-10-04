import { ResourceParameter } from "./resource-parameter";

export class SupplierResourceParameter extends ResourceParameter {
  supplierName: string = '';
  mobileNo: string = '';
  email: string = '';
  website?: string = '';
  country?: string = '';
  id?:string='';
}
