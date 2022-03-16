import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AppointmentTypeService } from '../_services/appointment-type.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { AppointmentTypeResponseDTO } from '../_dto/AppointmentTypeResponseDTO';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    patientEmail: null,
    patientPassword: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  patientComleteName = '';
  appointmentTypeResponseDTO!: AppointmentTypeResponseDTO[]

  constructor(private authService: AuthService, private appointmentTypeService: AppointmentTypeService, private tokenStorage: TokenStorageService, private router: Router) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.patientComleteName = this.tokenStorage.getPatient().patientName + " " + this.tokenStorage.getPatient().patientLastname;
      this.appointmentTypeService.getAppointmentTypes().subscribe({
        next: data => {
          this.tokenStorage.saveAppointmentTypes(data);
        }
      });
    }
  }

  onSubmit(): void {
    const { patientEmail, patientPassword } = this.form;

    this.authService.login(patientEmail, patientPassword).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.savePatient(data);

        this.patientComleteName = this.tokenStorage.getPatient().patientName + " " + this.tokenStorage.getPatient().patientLastname;
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.redirectToAppointmentsList();
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }

  redirectToAppointmentsList(): void {
    window.location.reload();
  }

}
