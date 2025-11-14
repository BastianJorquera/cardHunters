import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { IonAvatar } from '@ionic/angular/standalone';

// Imports para Standalone
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import {
  IonContent,
  IonIcon,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    IonContent,
    IonIcon,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonSpinner,
    IonAvatar
  ],
})
export class PerfilPage implements OnInit {

  // Ya no necesitamos 'isLoggedIn$', el Guardia se encarga.
  public usuario: any | null = null; // Cambia 'any' por tu interfaz 'Usuario'

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    addIcons({ logOutOutline });
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  ionViewWillEnter() {
    // Refresca los datos cada vez que entras
    this.cargarDatosUsuario();
  }

  /**
   * El Guardia ya confirmó que estamos logueados.
   * Solo necesitamos cargar los datos.
   */
  cargarDatosUsuario() {
  // Si ya tenemos el usuario cargado en el servicio, úsalo directamente
  if (this.usuarioService.usuario) {
    this.usuario = this.usuarioService.usuario;
    return;
  }

  // Si no está cargado, muestra spinner y pide los datos al backend
  this.usuario = null;
  this.usuarioService.getProfile().subscribe({
    next: (data) => {
      this.usuario = data;
    },
    error: (err) => {
      console.error('Error al obtener perfil:', err);
      this.usuarioService.logout();
      this.router.navigateByUrl('/login');
    }
  });
  }

  
  //Llama al servicio para cerrar sesión
  
  cerrarSesion() {
    this.usuarioService.logout();
    this.router.navigateByUrl('/login'); // Envíalo a login
  }

  irAEditarPerfil() {
    this.router.navigateByUrl('/editar-perfil'); // Navega a la página de editar perfil
  }
}
