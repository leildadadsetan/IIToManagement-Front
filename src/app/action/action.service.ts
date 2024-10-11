import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action } from '@core/domain-classes/action';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  constructor(
    private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  updateAction(action: Action): Observable<Action | CommonError> {
    const url = `action/${action.id}`;
    return this.httpClient.put<Action>(url, action)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addAction(action: Action): Observable<Action | CommonError> {
    const url = `action`;
    return this.httpClient.post<Action>(url, action)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deleteAction(id: string): Observable<void | CommonError> {
    const url = `action/${id}`;
    return this.httpClient.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getAction(id: string): Observable<Action | CommonError> {
    const url = `action/${id}`;
    return this.httpClient.get<Action>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

 
}
