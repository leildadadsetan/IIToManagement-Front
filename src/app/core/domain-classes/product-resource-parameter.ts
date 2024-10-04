import { ResourceParameter } from "./resource-parameter";
export class ProductResourceParameter extends ResourceParameter {
    name: string = '';
    unitId?: string = '';
    barcode?:string ='';
    categoryId?: string = '';
    brandId?: string = '';
    id?: string='';
}
