import { EntityState } from './entity-state';
import { SupplierAddress } from './supplier-address';


export interface Supplier {
  id: string;
  supplierName: string;
  contactPerson: string;
  mobileNo: string;
  phoneNo: string;
  objectState?: EntityState;
  isDeleted?: boolean;
  isVerify?: boolean;
  isSendMail?: boolean;
  supplierAddress?: SupplierAddress;
  billingAddress?: SupplierAddress;
  shippingAddress?: SupplierAddress;
  description: string;
  website: string;
  isVarified?: boolean;
  url?: string;
  imageUrl?: string;
  logo?: string;
  supplierProfile?: string;
  isUnsubscribe?: boolean
  isImageUpload?: boolean;
  email?: string;
}
