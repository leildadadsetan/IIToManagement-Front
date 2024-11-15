import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { UserGroup } from '@core/domain-classes/user-group';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { UserGroupService } from '../user-group.service';


@Injectable()
export class UserGroupResolverService implements Resolve<UserGroup> {
    constructor(
        private userGroupService: UserGroupService,
        private router: Router
    ) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<UserGroup> | null {
        const id = route.paramMap.get('id');
        if (id === 'addItem') {
            return null;
        }
        return this.userGroupService.getUserGroup(id).pipe(
            take(1),
            mergeMap((group) => {
                if (group) {
                    return of(group);
                } else {
                    this.router.navigate(['/group']);
                    return null;
                }
            })
        );
    }
}
