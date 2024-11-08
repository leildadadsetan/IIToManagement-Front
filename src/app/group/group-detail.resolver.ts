import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Group } from '@core/domain-classes/group';
import { Observable } from 'rxjs';
import { GroupService } from './group.service';

@Injectable()
export class GroupDetailResolverService implements Resolve<Group> {
    constructor(private roleService: GroupService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Group> {
        const name = route.paramMap.get('id');
        return this.roleService.getGroup(name) as Observable<Group>;
    }
}