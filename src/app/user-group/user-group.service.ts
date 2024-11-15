import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GroupResourceParameter } from '@core/domain-classes/group-resource-parameter';
 import { UserGroup } from '@core/domain-classes/user-group';

@Injectable({
  providedIn: 'root',
})
export class UserGroupService {
  constructor(private httpClient: HttpClient) { }

  getUserGroups(
    resourceParams: GroupResourceParameter
  ): Observable<HttpResponse<UserGroup[]>> {
    const url = 'group';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields ? resourceParams.fields : '')
      .set('OrderBy', resourceParams.orderBy ? resourceParams.orderBy : '')
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery ? resourceParams.searchQuery : '')
        return this.httpClient.get<UserGroup[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  
  getUserGroup(id: string): Observable<UserGroup> {
    const url = 'group/' + id;
    return this.httpClient.get<UserGroup>(url);
  }

  deleteUserGroup(id: string): Observable<void> {
    const url = `group/${id}`;
    return this.httpClient.delete<void>(url);
  }

  updateUserGroup(id: string, group: UserGroup): Observable<UserGroup> {
    const url = 'group/' + id;
    return this.httpClient.put<UserGroup>(url, group);
  }
}
