import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentMethod, paymentMethods } from '@core/domain-classes/payment-method';
import { SalesOrderPayment } from '@core/domain-classes/sales-order-payment';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderPaymentService {

  constructor(private http: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getAllSalesOrderPaymentById(id: string): Observable<any> {
    const url = `SalesOrderPayment/${id}`;
    return this.http.get<SalesOrderPayment>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  addSalesOrderPayments(salesOrderPayment: SalesOrderPayment): Observable<SalesOrderPayment | CommonError> {
    const url = `SalesOrderPayment`;
    return this.http.post<SalesOrderPayment>(url, salesOrderPayment)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getPaymentMethod(): Observable<PaymentMethod[]> {
    return of(paymentMethods);
  }

  deleteSalesOrderPayment(id): Observable<void | CommonError> {
    const url = `SalesOrderPayment/${id}`;
    return this.http.delete<void>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
