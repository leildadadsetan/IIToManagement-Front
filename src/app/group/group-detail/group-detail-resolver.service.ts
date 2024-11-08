import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Group } from '@core/domain-classes/group';
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

import { GroupService } from '../group.service';
import { CommonError } from '@core/error-handler/common-error';

@Injectable()
export class GroupResolverService implements Resolve<Group | null> {
  constructor(
    private groupService: GroupService,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Group | null> {
    const id = route.paramMap.get('id');
    if (id === 'addItem') {
      return of(null);
    }

    return this.groupService.getGroup(id).pipe(
      take(1),
      map((result) => {
        if ('error' in result) {
          // Handle the error, e.g., navigate to a different route or show a message
          console.error(result.messages);
          this.router.navigate(['/group']);
          return null;
        }
        return result as Group;
      }),
      catchError((error) => {
        console.error('Error fetching group', error);
        this.router.navigate(['/group']);
        return of(null);
      })
    );
  }
}
