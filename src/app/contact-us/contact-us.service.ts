import { Injectable } from '@angular/core';
import { HttpParams, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactUsResource } from '@core/domain-classes/contact-us-resource';
import { ContactUs } from '@core/domain-classes/contact-us';

@Injectable({
    providedIn: 'root',
})
export class ContactUsService {
    constructor(private httpClient: HttpClient) { }

    getContactUsList(
        resourceParams: ContactUsResource
    ): Observable<HttpResponse<ContactUs[]>> {
        const url = 'contactus';
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
                'name',
                resourceParams.name ? resourceParams.name : ''
            )
            .set('phone', resourceParams.phone ? resourceParams.phone : '')
            .set('email', resourceParams.email ? resourceParams.email : '')

        return this.httpClient.get<ContactUs[]>(url, {
            params: customParams,
            observe: 'response',
        });
    }
    getContactUs(id: string): Observable<ContactUs> {
        const url = 'contactus/' + id;
        return this.httpClient.get<ContactUs>(url);
    }
    delectContactUs(id: string): Observable<void> {
        const url = `contactus/${id}`;
        return this.httpClient.delete<void>(url);
    }
}
