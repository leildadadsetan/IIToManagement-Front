export interface SalesOrderItemTax {
    id?: string;
    salesOrderItemId?: string;
    taxId: string;
    taxName?: string;
    taxPercentage?: number;
}
