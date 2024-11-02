import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { GroupResourceParameter } from '@core/domain-classes/group-resource-parameter';
import { Group } from '@core/domain-classes/group';
import { GroupList } from '@core/domain-classes/group-list';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  getGroups(
    resourceParams: GroupResourceParameter
  ): Observable<HttpResponse<Group[]>> {
    const url = 'group';
    const groupParams = new HttpParams()
      .set('fields', resourceParams.fields)
      .set('orderBy', resourceParams.orderBy)
      .set('pageSize', resourceParams.pageSize.toString())
      .set('skip', resourceParams.skip.toString())
      .set('searchQuery', resourceParams.searchQuery)
      .set('groupName', resourceParams.groupName)
    return this.http.get<Group[]>(url, {
      params: groupParams,
      observe: 'response',
    });
  }

  getGroupsForDropDown(
    searchBy: string,
    searchString: string
  ): Observable<Group[]> {
    const url = 'group/search';
    if (searchString && searchBy) {
      let params = `?searchQuery=${searchString.trim()}&searchBy=${searchBy}&pageSize=10`;
      return this.http.get<Group[]>(url + params);
    }
    return of([]);
  }

  getGroup(id: string): Observable<Group> {
    const url = 'group/' + id;
    return this.http.get<Group>(url);
  }

  deleteGroup(id: string): Observable<void> {
    const url = 'group/' + id;
    return this.http.delete<void>(url);
  }
  updateGroup(id: string, group: Group): Observable<Group> {
    const url = 'group/' + id;
    return this.http.put<Group>(url, group);
  }
  saveGroup(group: Group): Observable<Group> {
    const url = 'group';
    return this.http.post<Group>(url, group);
  }
 
 
}
