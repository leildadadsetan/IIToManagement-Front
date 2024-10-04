import { ProductTax } from "./product-tax";
import { Unit } from "./unit";
import { UnitConversation } from "./unit-conversation";

export interface Product {
    id?: string;
    name: string;
    code: string;
    barcode: string;
    skuCode: string;
    skuName: string;
    description: string;
    productUrl: string;
    qrCodeUrl: string;
    unitId: string;
    purchasePrice: number;
    salesPrice: number;
    mrp: number;
    categoryId: string;
    productUrlData: string;
    isProductImageUpload: boolean;
    qRCodeUrlData: string;
    isQrCodeUpload: boolean;
    productTaxes: ProductTax[];
    unit?: UnitConversation;
    categoryName?: string;
    unitName?: string;
    warehouseId?:string; 
}

