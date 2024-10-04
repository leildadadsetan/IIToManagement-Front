import { Product } from "./product";
import { PurchaseOrderStatusEnum } from "./purchase-order-status";
import { SalesOrderItemTax } from "./sales-order-item-tax";
import { UnitConversation } from "./unit-conversation";

export interface SalesOrderItem {
  id?: string;
  productId: string;
  salesOrderId?: string;
  unitPrice: number;
  unitId?:string;
  quantity: number;
  taxValue: number;
  discount: number;
  product?: Product;
  discountPercentage: number;
  status?: PurchaseOrderStatusEnum;
  unitName?: string;
  salesOrderItemTaxes: SalesOrderItemTax[];
  productName?: string;
  salesOrderNumber?: string;
  customerName?: string;
  soCreatedDate?: Date;
  warehouseId?:string; 
  warehouseName?:string; 
  unitConversation?: UnitConversation;
}
