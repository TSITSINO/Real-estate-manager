import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeographicalInformationService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9d03c846-15f9-490e-8c26-2875d110d269';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
  }

  getRegions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/regions`, {});
  }

  getCities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cities`, {});
  }
}
