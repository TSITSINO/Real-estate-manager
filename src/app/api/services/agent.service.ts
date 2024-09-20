import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agent, NewAgena } from '../model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9d03c846-15f9-490e-8c26-2875d110d269';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
  }

  getAgents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/agents`, {
      headers: this.getHeaders(),
    });
  }

  postAgent(agent: NewAgena): Observable<any> {
    const formData = new FormData();

    if (agent.name) formData.append('name', agent.name);
    if (agent.surname) formData.append('surname', agent.surname);
    if (agent.phone) formData.append('phone', agent.phone);
    if (agent.email) formData.append('email', agent.email);
    if (agent.avatar instanceof File) {
      formData.append('avatar', agent.avatar);
    }

    return this.http.post(`${this.apiUrl}/agents`, formData, {
      headers: this.getHeaders(),
    });
  }
}
