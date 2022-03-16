import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const PATIENT_KEY = 'auth-patient';
const APPOINTMENT_KEY = 'appointment-types';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public savePatient(patient: any): void {
    window.sessionStorage.removeItem(PATIENT_KEY);
    window.sessionStorage.setItem(PATIENT_KEY, JSON.stringify(patient));
  }

  public saveAppointmentTypes(appointmentTypes: any): void {
    window.sessionStorage.removeItem(APPOINTMENT_KEY);
    window.sessionStorage.setItem(APPOINTMENT_KEY, JSON.stringify(appointmentTypes));
  }

  public getPatient(): any {
    const patient = window.sessionStorage.getItem(PATIENT_KEY);
    if (patient) {
      return JSON.parse(patient);
    }

    return {};
  }

  public getAppointmentTypes(): any {
    const appointmentTypes = window.sessionStorage.getItem(APPOINTMENT_KEY);
    if (appointmentTypes) {
      return JSON.parse(appointmentTypes);
    }
    return {};
  }
  
}
