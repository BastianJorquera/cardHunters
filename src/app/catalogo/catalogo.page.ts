import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartasService, Carta } from '../services/cartas.service'; // Importa el servicio y la interfaz
import { CarritoService } from '../services/carrito.service';

// Imports para Standalone
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component'; // Importa tu Header
// --- ¡ARREGLO 1: Importamos los componentes de Ionic uno por uno! ---
import {
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonRippleEffect,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonSpinner,
  ToastController // ToastController se inyecta, no se importa aquí
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-catalogo',
  templateUrl: 'catalogo.page.html',
  styleUrls: ['catalogo.page.scss'],
  standalone: true,
  // --- ¡ARREGLO 1: Añadimos los componentes al array de imports! ---
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonRippleEffect,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonSpinner
  ],
})
export class CatalogoPage implements OnInit {

  public cartas$: Observable<Carta[]>; // Un observable para las cartas

  constructor(
    private cartasService: CartasService,
    private carritoService: CarritoService,
    private toastController: ToastController // ToastController se inyecta
  ) {
    // Inicializa el observable (aún no se suscribe)
    this.cartas$ = this.cartasService.getCartas();
  }

  ngOnInit() {
  }

  /**
   * Llama al CarritoService para añadir un item
   */
  async agregarAlCarrito(carta: Carta, event: Event) {
    event.stopPropagation(); // Evita que el clic se propague a la card
    this.carritoService.addItem(carta);

    // Muestra una notificación (Toast)
    const toast = await this.toastController.create({
      message: `${carta.nombre} añadido al carrito`,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  verDetalleCarta(carta: Carta) {
    console.log('Navegar al detalle de:', carta.nombre);
    // this.router.navigateByUrl(`/detalle-carta/${carta.id}`);
  }
}

