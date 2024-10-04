import { UnitOperator } from "./operator";

export class UnitConversation {
    id: string;
    name: string;
    parentId: string;
    code?:string;
    deafLevel?: number;
    index?: number;
    value?:string;
    operator?: number;
    baseUnitName?:string;
}