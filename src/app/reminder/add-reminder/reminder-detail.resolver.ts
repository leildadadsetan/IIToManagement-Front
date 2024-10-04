import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { Reminder } from '@core/domain-classes/reminder';
import { ReminderService } from '../reminder.service';


@Injectable()
export class ReminderDetailResolverService implements Resolve<Reminder> {
    constructor(private cs: ReminderService, private router: Router) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Reminder> | null {
        const id = route.paramMap.get('id');
        if (id === 'add') {
            return null;
        }
        return this.cs.getReminder(id).pipe(
            take(1),
            mergeMap((reminder: Reminder) => {
                if (reminder) {
                    return of(reminder);
                } else {
                    this.router.navigate(['/reminders']);
                    return null;
                }
            })
        );
    }
}
