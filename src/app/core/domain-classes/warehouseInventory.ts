import { Product } from "./product";


export class WarehouseInventory{
  id?: string;
  productId?: string;
  satock?: number;
  product?: Product;
  productName?: string;
  warehouseId?:string;
  warehouseName?:string;

}
