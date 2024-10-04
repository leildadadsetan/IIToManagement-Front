import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse, HttpClient, HttpParams } from '@angular/common/http';
import { CityResourceParameter } from '@core/domain-classes/city-resource-parameter';
import { City } from '@core/domain-classes/city';

@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) { }

  getCities(
    resourceParams: CityResourceParameter
  ): Observable<HttpResponse<City[]>> {
    const url = 'city';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields)
      .set('OrderBy', resourceParams.orderBy)
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set('SearchQuery', resourceParams.searchQuery)
      .set('cityName', resourceParams.cityName)
      .set('countryName', resourceParams.countryName ? resourceParams.countryName : '')

    return this.http.get<City[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getCity(id: string): Observable<City> {
    const url = 'city/' + id;
    return this.http.get<City>(url);
  }
  deleteCity(id: string): Observable<void> {
    const url = `city/${id}`;
    return this.http.delete<void>(url);
  }
  updateCity(id: string, city: City): Observable<City> {
    const url = 'city/' + id;
    return this.http.put<City>(url, city);
  }
  saveCity(city: City): Observable<City> {
    const url = 'city';
    return this.http.post<City>(url, city);
  }

}
