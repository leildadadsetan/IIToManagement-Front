import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { UserGroup } from '@core/domain-classes/user-group';
import { Observable } from 'rxjs';
import { UserGroupService } from './user-group.service';

@Injectable()
export class UserDetailResolverService implements Resolve<UserGroup> {
    constructor(private userService: UserGroupService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<UserGroup> {
        const id = route.paramMap.get('id');
        return this.userService.getUserGroup(id) as Observable<UserGroup>;
    }
}
