import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/saludtools/api/v1/patient/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(patientEmail: string, patientPassword: string): Observable<any> {
    return this.http.post(AUTH_API + 'login', {
      patientEmail,
      patientPassword
    }, httpOptions);
  }

  register(patientCreateRequestDTO: Object): Observable<any> {
    return this.http.post(AUTH_API + 'create', patientCreateRequestDTO, httpOptions);
  }
}
