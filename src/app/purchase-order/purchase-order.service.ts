import { HttpClient, HttpEvent, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PurchaseOrder } from '@core/domain-classes/purchase-order';
import { PurchaseOrderItem } from '@core/domain-classes/purchase-order-item';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order-resource-parameter';
import { PurchaseOrderStatusEnum } from '@core/domain-classes/purchase-order-status';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderService {

  constructor(private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getAllPurchaseOrder(
    resourceParams: PurchaseOrderResourceParameter
  ): Observable<HttpResponse<PurchaseOrder[]>> {
    const url = 'purchaseorder';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('supplierName', resourceParams.supplierName)
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
      .set('productId', resourceParams.productId ? resourceParams.productId : '')
      .set('supplierId', resourceParams.supplierId ? resourceParams.supplierId : '')
      .set('isPurchaseOrderRequest', resourceParams.isPurchaseOrderRequest)
      .set('status', resourceParams.status);
    return this.http.get<PurchaseOrder[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  getAllPurchaseOrderReport(
    resourceParams: PurchaseOrderResourceParameter
  ): Observable<HttpResponse<PurchaseOrder[]>> {
    const url = 'purchaseorder/report';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('supplierName', resourceParams.supplierName)
      .set('fromDate', resourceParams.fromDate ? resourceParams.fromDate.toDateString() : '')
      .set('toDate', resourceParams.toDate ? resourceParams.toDate.toDateString() : '')
      .set('productId', resourceParams.productId ? resourceParams.productId : '')
      .set('supplierId', resourceParams.supplierId ? resourceParams.supplierId : '')
      .set('isPurchaseOrderRequest', resourceParams.isPurchaseOrderRequest)
    return this.http.get<PurchaseOrder[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  getPurchaseOrderItemReport(
    resourceParams: PurchaseOrderResourceParameter
  ): Observable<HttpResponse<PurchaseOrderItem[]>> {
    const url = 'purchaseorder/items/reports';
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
      .set('productName', resourceParams.productName?resourceParams.productName:'')
      .set('supplierId', resourceParams.supplierId ? resourceParams.supplierId : '')
      .set('isPurchaseOrderRequest', resourceParams.isPurchaseOrderRequest)
    return this.http.get<PurchaseOrderItem[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  getAllPurchaseOrderItemReport(
    resourceParams: PurchaseOrderResourceParameter
  ): Observable<HttpResponse<PurchaseOrderItem[]>> {
    const url = 'purchaseorder/items/reports';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', 0)
      .set('Skip', 0)
      .set('SearchQuery', resourceParams.searchQuery)
      .set('name', resourceParams.name)
      .set('orderNumber', resourceParams.orderNumber)
      .set('supplierName', resourceParams.supplierName)
      .set('fromDate', resourceParams.fromDate?resourceParams.fromDate.toDateString():'')
      .set('toDate',  resourceParams.toDate?resourceParams.toDate.toDateString():'')
      .set('productId', resourceParams.productId?resourceParams.productId:'')
      .set('productName', resourceParams.productName?resourceParams.productName:'')
      .set('supplierId', resourceParams.supplierId ? resourceParams.supplierId : '')
      .set('isPurchaseOrderRequest', resourceParams.isPurchaseOrderRequest)
    return this.http.get<PurchaseOrderItem[]>(url, {
      params: customParams,
      observe: 'response'
    });
  }

  addPurchaseOrder(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder | CommonError> {
    const url = `PurchaseOrder`;
    return this.http.post<PurchaseOrder>(url, purchaseOrder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updatePurchaseOrder(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder | CommonError> {
    const url = `PurchaseOrder/${purchaseOrder.id}`;
    return this.http.put<PurchaseOrder>(url, purchaseOrder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  updatePurchaseOrderReturn(purchaseOrder: PurchaseOrder): Observable<PurchaseOrder | CommonError> {
    const url = `PurchaseOrder/${purchaseOrder.id}/return`;
    return this.http.put<PurchaseOrder>(url, purchaseOrder)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  deletePurchaseOrder(id: string): Observable<void | CommonError> {
    const url = `PurchaseOrder/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getNewPurchaseOrderNumber(isPurchaseOrder: boolean): Observable<PurchaseOrder> {
    const url = `purchaseorder/newOrderNumber/${isPurchaseOrder}`;
    return this.http.get<PurchaseOrder>(url);
  }

  getPurchaseOrderById(purchaseOrderId: string): Observable<PurchaseOrder> {
    const url = `purchaseorder/${purchaseOrderId}`;
    return this.http.get<PurchaseOrder>(url);
  }

  getPurchaseOrderItems(purchaseOrderId: string, isReturn: boolean = false): Observable<PurchaseOrderItem[]> {
    const url = `purchaseorder/${purchaseOrderId}/items?isReturn=${isReturn}`;
    return this.http.get<PurchaseOrderItem[]>(url);
  }

  downloadAttachment(id: string): Observable<HttpEvent<Blob>> {
    const url = `PurchaseOrderAttachment/${id}/download`;
    return this.http.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
}
