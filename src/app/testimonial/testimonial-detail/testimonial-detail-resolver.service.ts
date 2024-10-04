import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Testimonial } from '@core/domain-classes/testimonial';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { TestimonialService } from '../testimonial.service';


@Injectable()
export class TestimonialDetailResolverService implements Resolve<Testimonial> {
    constructor(
        private testimonialService: TestimonialService,
        private router: Router
    ) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Testimonial> | null {
        const id = route.paramMap.get('id');
        if (id === 'addItem') {
            return null;
        }
        return this.testimonialService.getTestimonial(id).pipe(
            take(1),
            mergeMap((testimonial) => {
                if (testimonial) {
                    return of(testimonial);
                } else {
                    this.router.navigate(['/testimonial']);
                    return null;
                }
            })
        );
    }
}
