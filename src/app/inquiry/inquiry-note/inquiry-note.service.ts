import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InquiryNote } from '@core/domain-classes/inquiry-note';

@Injectable({ providedIn: 'root' })
export class InquiryNoteService {
  constructor(private httpClient: HttpClient) { }

  getInquiryNotes(inquieryId: string): Observable<InquiryNote[]> {
    const url = `inquiryNote/${inquieryId}`;
    return this.httpClient.get<InquiryNote[]>(url)
  }
  deleteInquiryNote(id: string): Observable<void> {
    const url = `inquiryNote/${id}`;
    return this.httpClient.delete<void>(url);
  }
  updateInquiryNote(id: string, inquiryNote: InquiryNote): Observable<InquiryNote> {
    const url = 'inquiryNote/' + id;
    return this.httpClient.put<InquiryNote>(url, inquiryNote);
  }
  saveInquiryNote(inquiryNote: InquiryNote): Observable<InquiryNote> {
    const url = 'inquiryNote/';
    return this.httpClient.post<InquiryNote>(url, inquiryNote);
  }

}
