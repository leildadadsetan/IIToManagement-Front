import { ResourceParameter } from "./resource-parameter";

export class ExpenseResourceParameter extends ResourceParameter {
    reference?: string;
    expenseCategoryId?: string;
    description?: string;
    expenseById:string;
    fromDate?: Date;
    toDate?: Date;
}
