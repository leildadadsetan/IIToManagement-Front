import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { UserGroup } from '@core/domain-classes/user-group';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { catchError } from 'rxjs/operators';
import { UserGroupResource } from '@core/domain-classes/user-group-resource';

@Injectable({ providedIn: 'root' })
export class UserGroupService {

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  updateUserGroup(userGroup: UserGroup): Observable<UserGroup | CommonError> {
    const url = `user-group/${userGroup.id}`;
    return this.httpClient.put<UserGroup>(url, userGroup)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addUserGroup(userGroup: UserGroup): Observable<UserGroup | CommonError> {
    const url = `user-group`;
    return this.httpClient.post<UserGroup>(url, userGroup)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteUserGroup(id: string): Observable<void | CommonError> {
    const url = `user-group/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUserGroup(id: string): Observable<UserGroup | CommonError> {
    const url = `user-group/${id}`;
    return this.httpClient.get<UserGroup>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getUserGroups(resource: UserGroupResource): Observable<HttpResponse<UserGroup[]> | CommonError> {
    const url = `user-group/GetUserGroups`;
    const customParams = new HttpParams()
      .set('Fields', resource.fields)
      .set('OrderBy', resource.orderBy)
      .set('PageSize', resource.pageSize.toString())
      .set('Skip', resource.skip.toString())
      .set('SearchQuery', resource.searchQuery)
      .set('groupName', resource.name.toString())

    return this.httpClient.get<UserGroup[]>(url, {
      params: customParams,
      observe: 'response'
    }).pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
