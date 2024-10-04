import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquiryResourceParameter } from '@core/domain-classes/inquiry-resource-parameter';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryStatus } from '@core/domain-classes/inquiry-status';
import { InquiryProduct } from '@core/domain-classes/inquiry-product';
import { Product } from '@core/domain-classes/product';

@Injectable({
    providedIn: 'root',
})
export class InquiryService {
    constructor(private httpClient: HttpClient) { }

    getInquiries(
        resourceParams: InquiryResourceParameter
    ): Observable<HttpResponse<Inquiry[]>> {
        const url = 'inquiry';
        const customParams = new HttpParams()
            .set('Fields', resourceParams.fields ? resourceParams.fields : '')
            .set('OrderBy', resourceParams.orderBy ? resourceParams.orderBy : '')
            .set('PageSize', resourceParams.pageSize.toString())
            .set('Skip', resourceParams.skip.toString())
            .set(
                'SearchQuery',
                resourceParams.searchQuery ? resourceParams.searchQuery : ''
            )
            .set(
                'companyName',
                resourceParams.companyName ? resourceParams.companyName : ''
            )
            .set('mobileNo', resourceParams.mobileNo ? resourceParams.mobileNo : '')
            .set('cityName', resourceParams.city ? resourceParams.city : '')
            .set('phoneNo', resourceParams.phoneNo ? resourceParams.phoneNo : '')
            .set('email', resourceParams.email ? resourceParams.email : '')
            .set('assignTo', resourceParams.assignTo ? resourceParams.assignTo : '')
            .set('inquiryStatusId', resourceParams.inquiryStatusId ? resourceParams.inquiryStatusId : '')
            .set('inquirySourceId', resourceParams.inquirySourceId ? resourceParams.inquirySourceId : '')
            .set(
                'contactPerson',
                resourceParams.contactPerson ? resourceParams.contactPerson : ''
            );
        return this.httpClient.get<Inquiry[]>(url, {
            params: customParams,
            observe: 'response',
        });
    }
    getInquiry(id: string): Observable<Inquiry> {
        const url = 'inquiry/' + id;
        return this.httpClient.get<Inquiry>(url);
    }
    deleteInquiry(id: string): Observable<void> {
        const url = `inquiry/${id}`;
        return this.httpClient.delete<void>(url);
    }
    updateInquiry(id: string, inquiry: Inquiry): Observable<Inquiry> {
        const url = 'inquiry/' + id;
        return this.httpClient.put<Inquiry>(url, inquiry);
    }
    saveInquiry(inquiry: Inquiry): Observable<Inquiry> {
        const url = 'inquiry';
        return this.httpClient.post<Inquiry>(url, inquiry);
    }

    getProductsByInquiryId(id: string): Observable<Product[]> {
        const url = `inquiry/${id}/products`;
        return this.httpClient.get<Product[]>(url);
    }
}
