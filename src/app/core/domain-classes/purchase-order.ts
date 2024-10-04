import { DeliveryStatusEnum } from './delivery-status-enum';
import { PaymentStatus } from './paymentaStatus';
import { PurchaseOrderItem } from './purchase-order-item';
import { PurchaseOrderStatusEnum } from './purchase-order-status';
import { Supplier } from './supplier';

export interface PurchaseOrder {
  id?: string;
  orderNumber: string;
  poCreatedDate: Date;
  note?: string;
  termAndCondition?: string;
  isPurchaseOrderRequest: boolean;
  purchaseOrderStatus: PurchaseOrderStatusEnum;
  deliveryDate: Date;
  deliveryStatus: DeliveryStatusEnum;
  supplierId: string;
  totalAmount: number;
  totalTax: number;
  totalQuantity?: number;
  totalDiscount: number;
  totalPaidAmount?: number;
  supplier?: Supplier;
  supplierName?: string;
  paymentStatus?: PaymentStatus
  purchaseOrderItems: PurchaseOrderItem[];
  status?: number;
}
