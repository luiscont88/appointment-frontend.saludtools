import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppointmentTypeResponseDTO } from '../_dto/AppointmentTypeResponseDTO'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentTypeService {
  constructor(private http: HttpClient) { }

  private readonly baseUrl = 'http://localhost:8080/saludtools/api/v1/appointment/type/getlist';

  getAppointmentTypes(): Observable<AppointmentTypeResponseDTO[]> {
    return this.http.get<AppointmentTypeResponseDTO[]>(`${this.baseUrl}`);
  }

}
