import { PurchaseOrder } from "./purchase-order";
import { SalesOrder } from "./sales-order";

export class SalesOrderPayment{
      id:number;
      salesOrderId:number
      salesOrder: SalesOrder;
      paymentDate:Date;
      referenceNumber:string;
      orderNumber?: string;
      amount:number;
     //PaymentMethod PaymentMethod { get; set; }
      note:string;
      attachmentUrl:string;
      attachmentData:string;
      paymentMethod?: number;
}
