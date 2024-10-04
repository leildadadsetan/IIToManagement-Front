import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Inquiry } from '@core/domain-classes/inquiry';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

import { InquiryService } from '../inquiry.service';

@Injectable()
export class AddInquiryResolverService implements Resolve<Inquiry> {
    constructor(
        private inquiryService: InquiryService,
        private router: Router
    ) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Inquiry> | null {
        const id = route.paramMap.get('id');
        if (id === 'addItem') {
            return null;
        }
        return this.inquiryService.getInquiry(id).pipe(
            take(1),
            mergeMap((inquiry) => {
                if (inquiry) {
                    return of(inquiry);
                } else {
                    this.router.navigate(['/inquiry']);
                    return null;
                }
            })
        );
    }
}
