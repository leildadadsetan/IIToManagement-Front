import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfitLoss } from '@core/domain-classes/profitLoss';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { SalesOrderResourceParameter } from '@core/domain-classes/sales-order-resource-parameter';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class ProfitLossReportService {

  constructor(private http: HttpClient) { }

  getSaleOrderProfitLoss(
    resourceParams: SalesOrderResourceParameter
  ): Observable<ProfitLoss> {
    const url = 'salesOrder/items/profitLoss';
    const customParams = new HttpParams()
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
    return this.http.get<ProfitLoss>(url, {
      params: customParams,
    });
  }

  getPurchaseProfitLoss(
    resourceParams: SalesOrderResourceParameter
  ): Observable<ProfitLoss> {
    const url = 'purchaseorder/items/profitLoss';
    const customParams = new HttpParams()
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
    return this.http.get<ProfitLoss>(url, {
      params: customParams,
    });
  }

}
