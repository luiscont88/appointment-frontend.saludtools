import { Component, OnInit } from '@angular/core';
//import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  titulo?: string;
  subtitulo?: string;
  parrafo?: string;


  constructor(/*private userService: UserService*/) { }

  ngOnInit(): void {
    this.titulo = "AGENDAMIENTO DE CITAS";
    this.subtitulo = "La mejor atención!";
    this.parrafo = "Nuestra herramienta te permitirá agentar una cita con nuestros especialistas de manera fácil desde la comodidad de su hogar.";
  }
}
