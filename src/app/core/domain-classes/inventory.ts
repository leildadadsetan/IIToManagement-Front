
export interface Inventory {
    id?: string;
    productId?: string;
    stock: number;
    pricePerUnit: number;
    productName: string;
    unitName: string;
    averagePurchasePrice: number;
    averageSalesPrice:number;
    unitId:string;
}
