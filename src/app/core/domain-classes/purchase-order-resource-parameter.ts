import { PurchaseOrderStatusEnum } from './purchase-order-status';
import { ResourceParameter } from './resource-parameter';

export class PurchaseOrderResourceParameter extends ResourceParameter {
    orderNumber?: string = '';
    supplierName?: string = '';
    pOCreatedDate?: Date;
    supplierId?: string = '';
    isPurchaseOrderRequest: boolean = false;
    fromDate?: Date;
    toDate?: Date;
    productId?: string ='';
    productName?: string='';
    status?: PurchaseOrderStatusEnum = PurchaseOrderStatusEnum.All;
}
