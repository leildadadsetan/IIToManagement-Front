import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { Supplier } from '@core/domain-classes/supplier';
import { Guid } from 'guid-typescript';
import { SupplierList } from '@core/domain-classes/supplier-list';
import { SupplierPayment } from '@core/domain-classes/supplier-payment';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) { }

  getSuppliers(
    resourceParams: SupplierResourceParameter
  ): Observable<HttpResponse<Supplier[]>> {
    const url = 'supplier';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('supplierName', resourceParams.supplierName)
      .set('mobileNo', resourceParams.mobileNo)
      .set('email', resourceParams.email)
      .set('country', resourceParams.country ? resourceParams.country : '')
      .set('website', resourceParams.website)
    if (resourceParams.id) {
      customParams.append('id', resourceParams.id);
    }
    return this.http.get<Supplier[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getSupplier(id: string): Observable<Supplier> {
    const url = 'supplier/' + id;
    return this.http.get<Supplier>(url);
  }
  deleteSupplier(id: string): Observable<void> {
    const url = `supplier/${id}`;
    return this.http.delete<void>(url);
  }
  updateSupplier(id: string, supplier: Supplier): Observable<Supplier> {
    const url = 'supplier/' + id;
    return this.http.put<Supplier>(url, supplier);
  }
  saveSupplier(supplier: Supplier): Observable<Supplier> {
    const url = 'supplier';
    return this.http.post<Supplier>(url, supplier);
  }

  checkEmailOrPhoneExist(
    email: string,
    mobileNo: string,
    supplierId: string | Guid
  ): Observable<boolean> {
    const url = `supplier/${supplierId}/Exist?email=${email}&mobileNo=${mobileNo}`;
    return this.http.get<boolean>(url);
  }

  getSuppliersForDropDown(searchString: string): Observable<Supplier[]> {
    const url = 'SupplierSearch';
    if (searchString) {
      let params = `?searchQuery=${searchString.trim()}&pageSize=10`;
      return this.http.get<Supplier[]>(url + params);
    }
    return of([]);
  }

  getSupplierPayments(
    resourceParams: SupplierResourceParameter
  ): Observable<HttpResponse<SupplierPayment[]>> {
    const url = 'supplier/GetSupplierPayment';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('supplierName', resourceParams.supplierName)
    return this.http.get<SupplierPayment[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getSupplierPaymentsExcel(
    resourceParams: SupplierResourceParameter
  ): Observable<HttpResponse<SupplierPayment[]>> {
    const url = 'supplier/GetSupplierPayment';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('supplierName', resourceParams.supplierName)
    return this.http.get<SupplierPayment[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }
}
