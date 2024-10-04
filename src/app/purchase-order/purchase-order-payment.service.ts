import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentMethod, paymentMethods } from '@core/domain-classes/payment-method';
import { PurchaseOrderPayment } from '@core/domain-classes/purchase-order-payment';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PurchaseOrderPaymentService {

  constructor(private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getAllPurchaseOrderPaymentById(id: string): Observable<any> {
    const url = `PurchaseOrderPayment/${id}`;
    return this.http.get<PurchaseOrderPayment>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addPurchaseOrderPayments(purchaseOrderPayment: PurchaseOrderPayment): Observable<PurchaseOrderPayment | CommonError> {
    const url = `PurchaseOrderPayment`;
    return this.http.post<PurchaseOrderPayment>(url, purchaseOrderPayment)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getPaymentMethod(): Observable<PaymentMethod[]> {
    return of(paymentMethods);
  }

 deletePurchaseOrderPayment(id): Observable<void | CommonError> {
    const url = `PurchaseOrderPayment/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

}
