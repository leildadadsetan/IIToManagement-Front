import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Expense } from '@core/domain-classes/expense';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ExpenseService } from '../expense.service';


@Injectable()
export class ExpenseResolverService implements Resolve<Expense> {
    constructor(
        private expenseService: ExpenseService,
        private router: Router
    ) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Expense> | null {
        const id = route.paramMap.get('id');
        if (id === 'addItem') {
            return null;
        }
        return this.expenseService.getExpense(id).pipe(
            take(1),
            mergeMap((expense) => {
                if (expense) {
                    return of(expense);
                } else {
                    this.router.navigate(['/expense']);
                    return null;
                }
            })
        );
    }
}
