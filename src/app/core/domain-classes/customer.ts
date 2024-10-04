import { EntityState } from './entity-state';

export interface Customer {
  id: string;
  customerName: string;
  contactPerson: string;
  email: string;
  mobileNo: string;
  phoneNo: string;
  objectState?: EntityState;
  isDeleted?: boolean;
  isVerify?: boolean;
  isSendMail?: boolean;
  description: string;
  website: string;
  isVarified?: boolean;
  url?: string;
  imageUrl?: string;
  logo?: string;
  customerProfile?: string;
  isUnsubscribe?: boolean;
  isImageUpload?: boolean;
  address?: string;
  countryName?: string;
  cityName?: string;
  countryId?: string;
  cityId?: string;
  isWalkIn?: boolean;
}
