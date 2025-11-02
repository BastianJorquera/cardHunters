import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../../services/usuario.service'; // Ajusta la ruta si es necesario
import { CarritoService } from '../../services/carrito.service'; // Ajusta la ruta si es necesario

// Imports para Standalone
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// --- ¡ARREGLO AQUÍ! ---
// Importamos los componentes específicos en lugar de IonicModule
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBadge,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, logInOutline, cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  // --- ¡ARREGLO AQUÍ! ---
  // Añadimos los componentes específicos al array de imports
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonBadge,
    IonLabel
  ]
})
export class HeaderComponent {

  public isLoggedIn$: Observable<boolean | null>;
  public cantidadEnCarrito$: Observable<number>;

  constructor(
    private usuarioService: UsuarioService,
    private carritoService: CarritoService
  ) {
    // 1. "Escuchamos" el estado de login desde el UsuarioService
    this.isLoggedIn$ = this.usuarioService.isLogged;

    // 2. "Escuchamos" el estado del carrito desde el CarritoService
    //    Usamos 'map' para obtener solo la cantidad total de ítems
    this.cantidadEnCarrito$ = this.carritoService.carrito$.pipe(
      map(carrito => carrito.cantidadTotal)
    );

    // 3. Añadimos los íconos que usará este componente
    addIcons({ personCircleOutline, logInOutline, cartOutline });
  }
}

