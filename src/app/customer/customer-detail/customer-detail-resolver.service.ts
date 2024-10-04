import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Customer } from '@core/domain-classes/customer';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

import { CustomerService } from '../customer.service';

@Injectable()
export class CustomerResolverService implements Resolve<Customer> {
  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Customer> | null {
    const id = route.paramMap.get('id');
    if (id === 'addItem') {
      return null;
    }
    return this.customerService.getCustomer(id).pipe(
      take(1),
      mergeMap((customer) => {
        if (customer) {
          return of(customer);
        } else {
          this.router.navigate(['/customer']);
          return null;
        }
      })
    );
  }
}
