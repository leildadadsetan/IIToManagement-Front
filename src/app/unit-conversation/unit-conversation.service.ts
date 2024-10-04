import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UnitOperator, unitOperators } from '@core/domain-classes/operator';
import { UnitConversation } from '@core/domain-classes/unit-conversation';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitConversationService {

  constructor(private http: HttpClient) { }

  getUnitConversations(): Observable<UnitConversation[]> {
    const url = 'unitConversation';
    return this.http.get<UnitConversation[]>(url);
  }

  getUnitConversation(id: string): Observable<UnitConversation> {
    const url = 'unitConversation/' + id;
    return this.http.get<UnitConversation>(url);
  }
  deleteUnitConversation(id: string): Observable<void> {
    const url = `unitConversation/${id}`;
    return this.http.delete<void>(url);
  }
  updateUnitConversation(id: string, unitConversation: UnitConversation): Observable<UnitConversation> {
    const url = 'unitConversation/' + id;
    return this.http.put<UnitConversation>(url, unitConversation);
  }
  saveUnitConversation(unitConversation: UnitConversation): Observable<UnitConversation> {
    const url = 'unitConversation';
    return this.http.post<UnitConversation>(url, unitConversation);
  }

  getUnitOperator(): Observable<UnitOperator[]> {
    return of(unitOperators);
  }

  getAllBaseUnit(): Observable<UnitConversation[]> {
    const url = 'unitConversation/dropDown';
    return this.http.get<UnitConversation[]>(url);
  }

  // getUnitConversationforPO(id: string): Observable<UnitConversation[]> {
  //   const url = 'unitConversation/item/' + id;
  //   return this.http.get<UnitConversation[]>(url);

  // }

}
