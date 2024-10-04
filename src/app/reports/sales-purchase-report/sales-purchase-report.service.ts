import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SalesVsPurchase } from '@core/domain-classes/sales-purchase';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesPurchaseReportService {

  constructor(private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getSalesVsPurchaseReport(month, year): Observable<SalesVsPurchase[] | CommonError> {
    const url = `dashboard/salesvspurchase/${month}/${year}`;
    return this.httpClient.get<SalesVsPurchase[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
