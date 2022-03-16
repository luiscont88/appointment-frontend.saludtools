import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentService } from '../../_services/appointment.service';
import { FormControl, Validators } from '@angular/forms';
import { AppointmentCreateRequestDTO } from "../../_dto/AppointmentCreateRequestDTO";
import { AppointmentResponseDTO } from "../../_dto/AppointmentResponseDTO";
import { AppointmentTypeResponseDTO } from '../../_dto/AppointmentTypeResponseDTO';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-add.dialog',
  templateUrl: '../../dialogs/add/add.dialog.html',
  styleUrls: ['../../dialogs/add/add.dialog.css']
})
export class AddDialogComponent {
  constructor(public dialogRef: MatDialogRef<AddDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AppointmentCreateRequestDTO,
              @Inject(MAT_DIALOG_DATA) public data2: AppointmentResponseDTO,
              public appointmentService: AppointmentService,
              private tokenStorage: TokenStorageService) { }

  appointmentTypes: AppointmentTypeResponseDTO[] = this.tokenStorage.getAppointmentTypes();

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
  // empty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    let json = JSON.stringify(this.data.appointmentDate);
    let date = JSON.parse(json);
    let month = date.month < 10 ? "0"+date.month : date.month
    let day = date.day < 10 ? "0"+date.day : date.day
    let fulldate = date.year+"-"+month+"-"+day+" 00:00";
    this.data.appointmentDate = fulldate;
    this.data.appointmentIdPatient = this.tokenStorage.getPatient().id;
    this.appointmentService.createAppointment(this.data);
  }

}
