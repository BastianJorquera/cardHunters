import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

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
    IonSpinner
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
    this.usuario = null; // Muestra el spinner
    this.usuarioService.getProfile().subscribe({
      next: (data) => {
        this.usuario = data;
      },
      error: (err) => {
        // Si el token expiró o es inválido, el servicio
        // (o un interceptor futuro) debería cerrar la sesión.
        console.error('Error al obtener perfil:', err);
        this.usuarioService.logout();
        this.router.navigateByUrl('/login'); // Devuélvelo al login
      }
    });
  }

  /**
   * Llama al servicio para cerrar sesión
   */
  cerrarSesion() {
    this.usuarioService.logout();
    this.router.navigateByUrl('/login'); // Envíalo a login
  }
}
