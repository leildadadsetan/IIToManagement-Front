import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Testimonial } from '@core/domain-classes/testimonial';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestimonialService {

  constructor(private httpClient: HttpClient) { }

  getTestimonials(): Observable<Testimonial[]> {
    const url = 'testimonials/';
    return this.httpClient.get<Testimonial[]>(url);
  }

  getTestimonial(id: string): Observable<Testimonial> {
    const url = 'testimonials/' + id;
    return this.httpClient.get<Testimonial>(url);
  }

  deleteTestimonial(id: string): Observable<void> {
    const url = `testimonials/${id}`;
    return this.httpClient.delete<void>(url);
  }

  updateTestimonial(id: string, supplier: Testimonial): Observable<Testimonial> {
    const url = 'testimonials/' + id;
    return this.httpClient.put<Testimonial>(url, supplier);
  }

  saveTestimonial(supplier: Testimonial): Observable<Testimonial> {
    const url = 'testimonials';
    return this.httpClient.post<Testimonial>(url, supplier);
  }
}
