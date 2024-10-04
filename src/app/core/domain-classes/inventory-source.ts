export class InventorySource {
    id: number;
    name: string;
}

export const inventorySource: InventorySource[] = [
    {
        id: 0,
        name: 'DIRECT'
    }, {
        id: 1,
        name: 'PURCHASE_ORDER'
    }, {
        id: 2,
        name: 'SALES_ORDER'
    }, {
        id: 3,
        name: 'PURCHASE_ORDER_RETURN'
    }, {
        id: 4,
        name: 'SALES_ORDER_RETURN'
    }
];
