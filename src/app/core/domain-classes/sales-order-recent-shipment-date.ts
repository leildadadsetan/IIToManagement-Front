export interface SalesOrderRecentShipmentDate{
    salesOrderId: string;
    salesOrderNumber: string;
    expectedShipmentDate: Date;
    quantity: number;
    customerId: string;
    customerName: string;
  }