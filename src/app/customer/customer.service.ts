import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { CustomerResourceParameter } from '@core/domain-classes/customer-resource-parameter';
import { Customer } from '@core/domain-classes/customer';
import { CustomerList } from '@core/domain-classes/customer-list';
import { SupplierPayment } from '@core/domain-classes/supplier-payment';
import { CustomerPayment } from '@core/domain-classes/customer-payment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  getCustomers(
    resourceParams: CustomerResourceParameter
  ): Observable<HttpResponse<Customer[]>> {
    const url = 'customer';
    const customParams = new HttpParams()
      .set('fields', resourceParams.fields)
      .set('orderBy', resourceParams.orderBy)
      .set('pageSize', resourceParams.pageSize.toString())
      .set('skip', resourceParams.skip.toString())
      .set('searchQuery', resourceParams.searchQuery)
      .set('customerName', resourceParams.customerName)
      .set('mobileNo', resourceParams.mobileNo)
      .set('phoneNo', resourceParams.phoneNo)
      .set('email', resourceParams.email)
      .set('contactPerson', resourceParams.contactPerson)
      .set('website', resourceParams.website);
    return this.http.get<Customer[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getCustomersForDropDown(
    searchBy: string,
    searchString: string
  ): Observable<Customer[]> {
    const url = 'customer/search';
    if (searchString && searchBy) {
      let params = `?searchQuery=${searchString.trim()}&searchBy=${searchBy}&pageSize=10`;
      return this.http.get<Customer[]>(url + params);
    }
    return of([]);
  }

  getWalkInCustomer() {
    const url = 'customer/walkIn';
    return this.http.get<Customer>(url);
  }

  getCustomer(id: string): Observable<Customer> {
    const url = 'customer/' + id;
    return this.http.get<Customer>(url);
  }

  deleteCustomer(id: string): Observable<void> {
    const url = 'customer/' + id;
    return this.http.delete<void>(url);
  }
  updateCustomer(id: string, customer: Customer): Observable<Customer> {
    const url = 'customer/' + id;
    return this.http.put<Customer>(url, customer);
  }
  saveCustomer(customer: Customer): Observable<Customer> {
    const url = 'customer';
    return this.http.post<Customer>(url, customer);
  }
  checkEmailOrPhoneExist(
    email: string,
    mobileNo: string,
    id: string | Guid
  ): Observable<boolean> {
    const url = `customer/${id}/Exist?email=${email}&mobileNo=${mobileNo}`;
    return this.http.get<boolean>(url);
  }

  getCustomerPayments(
    resourceParams: CustomerResourceParameter
  ): Observable<HttpResponse<CustomerPayment[]>> {
    const url = 'customer/GetCustomerPayment';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('customerName', resourceParams.customerName);
    return this.http.get<CustomerPayment[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getCustomerPaymentsReport(
    resourceParams: CustomerResourceParameter
  ): Observable<HttpResponse<CustomerPayment[]>> {
    const url = 'customer/GetCustomerPayment/report';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('customerName', resourceParams.customerName);
    return this.http.get<CustomerPayment[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }
}
