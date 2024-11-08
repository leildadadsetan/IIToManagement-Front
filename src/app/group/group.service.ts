import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { GroupResourceParameter } from '@core/domain-classes/group-resource-parameter';
import { Group } from '@core/domain-classes/group';
import { catchError } from 'rxjs/operators';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { CommonError } from '@core/error-handler/common-error';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly baseUrl = 'group';

  constructor(
    private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService
  ) {}

  // Fetch all groups with resource parameters
  getGroups(resourceParams: GroupResourceParameter): Observable<HttpResponse<Group[]> | CommonError> {
    const url = `${this.baseUrl}`;
    const groupParams = new HttpParams()
      .set('fields', resourceParams.fields)
      .set('orderBy', resourceParams.orderBy)
      .set('pageSize', resourceParams.pageSize.toString())
      .set('skip', resourceParams.skip.toString())
      .set('searchQuery', resourceParams.searchQuery)
      .set('groupName', resourceParams.groupName)
      .set('isActive', resourceParams.isActive);

    return this.http.get<Group[]>(url, {
      params: groupParams,
      observe: 'response',
    }).pipe(
      catchError(this.commonHttpErrorService.handleError)
    );
  }

  updateGroup(group: Group): Observable<Group | CommonError> {
    const url = `role/${group.id}`;
    return this.http.put<Group>(url, group)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addGroup(group: Group): Observable<Group | CommonError> {
    const url = `group`;
    return this.http.post<Group>(url, group)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  // Fetch a single group by ID
  getGroup(id: string): Observable<Group | CommonError> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Group>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  // Delete a group by ID
  deleteGroup(id: string): Observable<void | CommonError> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

 

  // Create a new group
  saveGroup(group: Group): Observable<Group | CommonError> {
    const url = `${this.baseUrl}`;
    return this.http.post<Group>(url, group)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  // New method to fetch user groups, similar to getUsers in UserService
  getUserGroups(resourceParams: GroupResourceParameter): Observable<HttpResponse<Group[]> | CommonError> {
    debugger;
    const url = `${this.baseUrl}/GetUserGroups`;
    const groupParams = new HttpParams()
      .set('fields', resourceParams.fields)
      .set('orderBy', resourceParams.orderBy)
      .set('pageSize', resourceParams.pageSize.toString())
      .set('skip', resourceParams.skip.toString())
      .set('searchQuery', resourceParams.searchQuery)
      .set('groupName', resourceParams.groupName);
 
    return this.http.get<Group[]>(url, {
      params: groupParams,
      observe: 'response',
    }).pipe(
      catchError(this.commonHttpErrorService.handleError)
    );
  }
}
