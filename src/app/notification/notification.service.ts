import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';
import { ReminderResourceParameter } from '@core/domain-classes/reminder-resource-parameter';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private httpClient: HttpClient) { }

  getNotifications(resourceParams: ReminderResourceParameter): Observable<HttpResponse<ReminderScheduler[]>> {
    const url = 'reminder/notifications';
    const customParams = new HttpParams()
      .set('fields', resourceParams.fields)
      .set('orderBy', resourceParams.orderBy)
      .set('pageSize', resourceParams.pageSize.toString())
      .set('skip', resourceParams.skip.toString())
      .set('searchQuery', resourceParams.searchQuery);
    return this.httpClient.get<ReminderScheduler[]>(url, {
      params: customParams,
      observe: 'response',
    });

  }
  markAsReadNotifications(): Observable<boolean> {
    const url = 'reminder/notification/markasread';
    return this.httpClient.get<boolean>(url);
  }

}
