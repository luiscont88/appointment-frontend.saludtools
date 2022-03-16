import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  patientEmail?: string;

  constructor(private tokenStorageService: TokenStorageService,
    private _router: Router) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const patient = this.tokenStorageService.getPatient();
      this.patientEmail = patient.patientEmail;
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this._router.navigateByUrl('/home')
    setTimeout(
      function(){ 
      location.reload(); 
    }, 100);
    //window.location.reload();
  }
}
