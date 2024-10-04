import { ResourceParameter } from './resource-parameter';
import { SalesOrderStatusEnum } from './sales-order-status';

export class SalesOrderResourceParameter extends ResourceParameter {
    orderNumber?: string = '';
    customerName?: string = '';
    sOCreatedDate?: Date;
    customerId?: string = '';
    fromDate?: Date;
    toDate?: Date;
    productId: string;
    isSalesOrderRequest: boolean = false;
    status?: SalesOrderStatusEnum = SalesOrderStatusEnum.All;
    productName?: string;
}
