import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InquiryTask } from '@core/domain-classes/inquiry-task';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class InquiryTaskService {
  constructor(private httpClient: HttpClient) { }

  getInquiryTasks(inquieryId: string): Observable<InquiryTask[]> {
    const url = `inquiryActivity/${inquieryId}`;
    return this.httpClient.get<InquiryTask[]>(url)
  }
  deleteInquiryActivity(id: string): Observable<void> {
    const url = `inquiryActivity/${id}`;
    return this.httpClient.delete<void>(url);
  }
  updateInquiryActivity(id: string, inquiryTask: InquiryTask): Observable<InquiryTask> {
    const url = 'inquiryActivity/' + id;
    return this.httpClient.put<InquiryTask>(url, inquiryTask);
  }
  saveInquiryActivity(inquiryTask: InquiryTask): Observable<InquiryTask> {
    const url = 'inquiryActivity/';
    return this.httpClient.post<InquiryTask>(url, inquiryTask);
  }

}
