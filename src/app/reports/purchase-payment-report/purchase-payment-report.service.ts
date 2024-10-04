import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { Observable } from 'rxjs';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order-payment';

@Injectable({providedIn: 'root'})
export class PurchasePaymentReportService {
  constructor(private httpClient: HttpClient) {

   }

   getAllPurchaseOrderPaymentReport(
    resourceParams: PurchaseOrderResourceParameter
  ): Observable<HttpResponse<PurchaseOrderPayment[]>> {
    const url = 'PurchaseOrderPayment/report';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('supplierName', resourceParams.supplierName)
      .set('fromDate', resourceParams.fromDate?resourceParams.fromDate.toDateString():'')
      .set('toDate',  resourceParams.toDate?resourceParams.toDate.toDateString():'')
      .set('productId', resourceParams.productId?resourceParams.productId:'')
      .set('supplierId', resourceParams.supplierId ? resourceParams.supplierId : '')
      .set('isPurchaseOrderRequest', resourceParams.isPurchaseOrderRequest)
    return this.httpClient.get<PurchaseOrderPayment[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }
  getAllPurchaseOrderPaymentReportExcel(
    resourceParams: PurchaseOrderResourceParameter
  ): Observable<HttpResponse<PurchaseOrderPayment[]>> {
    const url = 'PurchaseOrderPayment/report';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', "0")
      .set('Skip', "0")
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('supplierName', resourceParams.supplierName)
      .set('fromDate', resourceParams.fromDate?resourceParams.fromDate.toDateString():'')
      .set('toDate',  resourceParams.toDate?resourceParams.toDate.toDateString():'')
      .set('productId', resourceParams.productId?resourceParams.productId:'')
      .set('supplierId', resourceParams.supplierId ? resourceParams.supplierId : '')
      .set('isPurchaseOrderRequest', resourceParams.isPurchaseOrderRequest)
    return this.httpClient.get<PurchaseOrderPayment[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

}
