export class AppointmentResponseDTO {
    id!: number;
    patientName!: string;
    patientLastname!: string;
    appointmentType!: string;
    appointmentTypeId!: string;
    appointmentDescription!: string;
    appointmentDate!: string;
    active!: boolean;
}