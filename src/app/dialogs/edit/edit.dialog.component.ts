import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Component, Inject} from '@angular/core';
import { AppointmentService } from "../../_services/appointment.service";
import {FormControl, Validators} from '@angular/forms';
import { AppointmentResponseDTO } from "../../_dto/AppointmentResponseDTO";
import { AppointmentTypeResponseDTO } from '../../_dto/AppointmentTypeResponseDTO';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: '../../dialogs/edit/edit.dialog.html',
  styleUrls: ['../../dialogs/edit/edit.dialog.css']
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AppointmentResponseDTO, private tokenStorage: TokenStorageService, public appointmentService: AppointmentService) { }

  formControl = new FormControl('', [
    Validators.required
    // Validators.email,
  ]);
  appointmentTypes: AppointmentTypeResponseDTO[] = this.tokenStorage.getAppointmentTypes();

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    let json = JSON.stringify(this.data.appointmentDate);
    let date = JSON.parse(json);
    let month = date.month < 10 ? "0"+date.month : date.month
    let day = date.day < 10 ? "0"+date.day : date.day
    let fulldate = date.year+"-"+month+"-"+day+" 00:00";
    this.data.appointmentDate = fulldate;
    this.appointmentService.updateApppointment(this.data.id, this.data);
  }
}
