import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquiryAttachment } from '@core/domain-classes/inquiry-attachment';

@Injectable({ providedIn: 'root' })
export class InquiryAttachmentService {
  constructor(private httpClient: HttpClient) { }

  getInquiryAttachments(inquieryId: string): Observable<InquiryAttachment[]> {
    const url = `inquiryAttachment/${inquieryId}`;
    return this.httpClient.get<InquiryAttachment[]>(url)
  }
  deleteInquiryAttachment(id: string): Observable<boolean> {
    const url = `inquiryAttachment/${id}`;
    return this.httpClient.delete<boolean>(url);
  }
  updateInquiryAttachment(id: string, inquiryAttachment: InquiryAttachment): Observable<InquiryAttachment> {
    const url = 'inquiryAttachment/' + id;
    return this.httpClient.put<InquiryAttachment>(url, inquiryAttachment);
  }
  saveInquiryAttachment(inquiryAttachment: InquiryAttachment): Observable<InquiryAttachment> {
    const url = 'inquiryAttachment/';
    return this.httpClient.post<InquiryAttachment>(url, inquiryAttachment);
  }

  downloadFile(id: string): Observable<HttpEvent<Blob>> {
    const url = `inquiryAttachment/${id}/download`;
    return this.httpClient.get(url, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }
}
