import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppointmentResponseDTO } from "../_dto/AppointmentResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private readonly baseUrl = 'http://localhost:8080/saludtools/api/v1/appointment';
  private getListPath = 'getlist';
  private deletePath = 'delete';
  private updatePath = 'update';
  private createPath = 'create';
  dataChange: BehaviorSubject<AppointmentResponseDTO[]> = new BehaviorSubject<AppointmentResponseDTO[]>([]);
  dialogData: any;

  constructor(private http: HttpClient) { }

  get data(): AppointmentResponseDTO[] {
    return this.dataChange.value;
  }
  
  getDialogData() {
    return this.dialogData;
  }
  
  createAppointment(appointment: Object) {
    this.http.post<AppointmentResponseDTO>(`${this.baseUrl}/${this.createPath}`, appointment).subscribe(data => {
      this.dialogData = data;
    },
    (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  /*updateApppointment(id: number, updateObject: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${this.updatePath}/${id}`, updateObject);
  }*/

  updateApppointment(id: number, updateObject: any) {
    this.http.put<AppointmentResponseDTO>(`${this.baseUrl}/${this.updatePath}/${id}`, updateObject).subscribe(data => {
      this.dialogData = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

  deleteAppointment(id: number) {
    this.http.put<AppointmentResponseDTO>(`${this.baseUrl}/${this.deletePath}`, {id: id}).subscribe(data => {
      this.dialogData = data;
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
    //return this.http.put(`${this.baseUrl}/${this.deletePath}/${id}`, { responseType: 'text' });
  }

  getAppointmentList(idPatient: number): void {
    this.http.get<AppointmentResponseDTO[]>(`${this.baseUrl}/${this.getListPath}/${idPatient}`).subscribe(data => {
      this.dataChange.next(data);
    },
    (error: HttpErrorResponse) => {
    console.log (error.name + ' ' + error.message);
    });
  }

}
