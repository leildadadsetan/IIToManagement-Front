import { Customer } from './customer';
import { DeliveryStatusEnum } from './delivery-status-enum';
import { PaymentStatus } from './paymentaStatus';
import { SalesOrderItem } from './sales-order-item';
import { SalesOrderStatusEnum } from './sales-order-status';

export interface SalesOrder {
    id?: string;
    orderNumber: string;
    soCreatedDate: Date;
    note?: string;
    termAndCondition?: string;
    isSalesOrderRequest: boolean;
    salesOrderStatus: SalesOrderStatusEnum;
    deliveryDate: Date;
    deliveryStatus: DeliveryStatusEnum;
    customerId: string;
    totalQuantity?: number;
    totalAmount: number;
    totalTax: number;
    totalDiscount: number;
    totalPaidAmount?: number;
    customer?: Customer;
    customerName?: string;
    paymentStatus?: PaymentStatus
    salesOrderItems: SalesOrderItem[];
    status?: number;
}
