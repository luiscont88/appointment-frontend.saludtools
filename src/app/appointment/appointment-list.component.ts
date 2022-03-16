import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import { AppointmentService } from "../_services/appointment.service";
import { AppointmentResponseDTO } from "../_dto/AppointmentResponseDTO";
import { TokenStorageService } from '../_services/token-storage.service';
import {AddDialogComponent} from '../dialogs/add/add.dialog.component';
import {EditDialogComponent} from '../dialogs/edit/edit.dialog.component';
import {DeleteDialogComponent} from '../dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {

  displayedColumns = ['Nombre(s)', 'Apellido(s)', 'Tipo de cita', 'Descripción de la cita', 'Fecha cita', 'Activa', 'Acciones'];
  dataService!: AppointmentService;
  dataSource!: FilterDataSource;
  index!: number;
  id!: number;
  patientFullName!: string;

  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public appointmentService: AppointmentService,
              private tokenStorage: TokenStorageService) {}

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  @ViewChild('filter',  {static: true}) filter!: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addNew() {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {issue: AppointmentResponseDTO}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.dataService.dataChange.value.push(this.appointmentService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, patientName: string, patientLastname: string, appointmentType: string, appointmentDescription: string, appointmentDate: string, appointmentTypeId: number) {
    this.id = id;
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {id: id, patientName: patientName, patientLastname: patientLastname, appointmentType: appointmentType, appointmentDescription: appointmentDescription, appointmentDate: appointmentDate, appointmentTypeId: appointmentTypeId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.dataService.dataChange.value.findIndex(x => x.id === this.id);
        this.dataService.dataChange.value[foundIndex] = this.appointmentService.getDialogData();
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, id: number, patientName: string, patientLastname: string, appointmentType: string, appointmentDescription: string, appointmentDate: string, appointmentTypeId: number) {
    this.index = i;
    this.id = id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {id: id, patientName: patientName, patientLastname: patientLastname, appointmentType: appointmentType, appointmentDescription: appointmentDescription, appointmentDate: appointmentDate, appointmentTypeId: appointmentTypeId}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.dataService.dataChange.value.findIndex(x => x.id === this.id);
        this.dataService.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.patientFullName = this.tokenStorage.getPatient().patientName+" "+this.tokenStorage.getPatient().patientLastname;
    this.dataService = new AppointmentService(this.httpClient);
    this.dataSource = new FilterDataSource(this.dataService, this.paginator, this.sort, this.tokenStorage);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
        location.reload();
      });
  }
}

export class FilterDataSource extends DataSource<AppointmentResponseDTO> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: AppointmentResponseDTO[] = [];
  renderedData: AppointmentResponseDTO[] = [];

  constructor(public _dataService: AppointmentService,
              public _paginator: MatPaginator,
              public _sort: MatSort,
              private tokenStorage: TokenStorageService) {
    super();
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  connect(): Observable<AppointmentResponseDTO[]> {
    const displayDataChanges = [
      this._dataService.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    const idPatient = this.tokenStorage.getPatient().id;
    this._dataService.getAppointmentList(idPatient);


    return merge(...displayDataChanges).pipe(map( () => {
        this.filteredData = this._dataService.data.slice().filter((appointment: AppointmentResponseDTO) => {
          const searchStr = (appointment.id + appointment.patientName + appointment.patientLastname + appointment.appointmentType + appointment.appointmentDescription + appointment.appointmentDate + appointment.active).toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
        const sortedData = this.sortData(this.filteredData.slice());
        const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
        this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
        return this.renderedData;
      }
    ));
  }

  disconnect() {}


  /** Returns a sorted copy of the database data. */
  sortData(data: AppointmentResponseDTO[]): AppointmentResponseDTO[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string | boolean = '';
      let propertyB: number | string | boolean = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'patientName': [propertyA, propertyB] = [a.patientName, b.patientName]; break;
        case 'patientLastname': [propertyA, propertyB] = [a.patientLastname, b.patientLastname]; break;
        case 'appointmentType': [propertyA, propertyB] = [a.appointmentType, b.appointmentType]; break;
        case 'appointmentDescription': [propertyA, propertyB] = [a.appointmentDescription, b.appointmentDescription]; break;
        case 'appointmentDate': [propertyA, propertyB] = [a.appointmentDate, b.appointmentDate]; break;
        case 'active': [propertyA, propertyB] = [a.active, b.active]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

}
