import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Group } from '@core/domain-classes/group';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';

import { GroupService } from '../group.service';

@Injectable()
export class GroupResolverService implements Resolve<Group> {
  constructor(
    private groupService: GroupService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Group> | null {
    const id = route.paramMap.get('id');
    if (id === 'addItem') {
      debugger;
      return null;
    }
    return this.groupService.getGroup(id).pipe(
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
