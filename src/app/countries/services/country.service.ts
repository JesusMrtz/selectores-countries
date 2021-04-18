import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { CountrySmall, Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  // tslint:disable-next-line:variable-name
  private _regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private baseUrl = 'https://restcountries.eu/rest/v2';

  get regions(): string[] {
    return [...this._regions];
  }

  constructor(private http: HttpClient) { }

  getCoutriesByRegion(region: string): Observable<CountrySmall[] | null> {
    if (region === '') {
      return of(null);
    }

    return this.http.get<CountrySmall[]>(`${this.baseUrl}/region/${region}?fields=name;alpha3Code`);
  }

  getCountiesByAlpha3Code(code: string): Observable<Country | null> {
    if (code === '') {
      return of(null);
    }

    return this.http.get<Country>(`${this.baseUrl}/alpha/${code}`);
  }

  getCountiesSmallByAlpha3Code(code: string): Observable<CountrySmall> {
    return this.http.get<CountrySmall>(`${this.baseUrl}/alpha/${code}?fields=name;alpha3Code`);
  }

  getCountriesByCode(borders: string []): Observable<CountrySmall[]> {
    if (!borders || !borders.length) {
      return of([]);
    }

    const requests: Observable<CountrySmall>[] = [];

    borders.forEach(code => {
      const request = this.getCountiesSmallByAlpha3Code(code);
      requests.push(request);
    });

    return combineLatest(requests);
  }
}
