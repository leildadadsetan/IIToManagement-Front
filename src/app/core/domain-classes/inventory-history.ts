export class InventoryHistory {
    id?: string;
    productId?: string;
    stock: number;
    inventorySource: number;
    pricePerUnit: number;
    createdDate: string;
    purchaseOrderNumber?: string;
    purchaseOrderId?: string;
    salesOrderNumber?: string;
    salesOrderId?: string;
}