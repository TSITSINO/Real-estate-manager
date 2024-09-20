import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NewRealEstate } from '../model';

@Injectable({
  providedIn: 'root',
})
export class RealEstateService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9d03c846-15f9-490e-8c26-2875d110d269';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
  }

  getRealEstates(): Observable<any> {
    return this.http.get(`${this.apiUrl}/real-estates`, {
      headers: this.getHeaders(),
    });
  }

  postRealEstates(realEstate: NewRealEstate): Observable<any> {
    const formData = new FormData();

    if (realEstate.address) formData.append('address', realEstate.address);
    if (realEstate.region_id)
      formData.append('region_id', realEstate.region_id.toString());
    if (realEstate.description)
      formData.append('description', realEstate.description);
    if (realEstate.city_id)
      formData.append('city_id', realEstate.city_id.toString());
    if (realEstate.zip_code) formData.append('zip_code', realEstate.zip_code);
    if (realEstate.price) formData.append('price', realEstate.price.toString());
    if (realEstate.area) formData.append('area', realEstate.area.toString());
    if (realEstate.bedrooms)
      formData.append('bedrooms', realEstate.bedrooms.toString());
    if (realEstate.is_rental !== null && realEstate.is_rental !== undefined)
      formData.append('is_rental', realEstate.is_rental.toString());
    if (realEstate.agent_id)
      formData.append('agent_id', realEstate.agent_id.toString());

    // Append the image file if available
    if (realEstate.image instanceof File) {
      formData.append('image', realEstate.image);
    }

    // Log FormData content for debugging
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    return this.http
      .post<any>(`${this.apiUrl}/real-estates`, formData, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(error);
        })
      );
  }
}
