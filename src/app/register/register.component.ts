import { Component, OnInit } from '@angular/core';
import { PatientCreateRequestDTO } from '../_dto/PatientCreateRequestDTO';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    patientName: null,
	  patientLastname: null,
	  patientAge: null,
	  patientPhone: null,
	  patientEmail: null,
	  patientPassword: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  patientCreateRequestDTO: PatientCreateRequestDTO = new PatientCreateRequestDTO();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(): void {

    this.patientCreateRequestDTO = this.form;

    this.authService.register(this.patientCreateRequestDTO).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
