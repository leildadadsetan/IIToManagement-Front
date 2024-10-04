export interface PurchaseOrderRecentDeliverySchedule {
    purchaseOrderId: string;
    purchaseOrderNumber: string;
    totalQuantity: number;
    expectedDispatchDate: Date;
    supplierId: string;
    supplierName: string;
  }