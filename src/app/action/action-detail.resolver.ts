import { Injectable } from '@angular/core';
import {
    Resolve,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Action } from '@core/domain-classes/action';
import { Observable } from 'rxjs';
import { ActionService } from './action.service';

@Injectable()
export class ActionDetailResolverService implements Resolve<Action> {
    constructor(private roleService: ActionService) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Action> {
        const name = route.paramMap.get('id');
        return this.roleService.getAction(name) as Observable<Action>;
    }
}