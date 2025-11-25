import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicacionesService, Publicacion } from '../services/publicaciones.service'; // Importa el servicio y la interfaz
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

  public publicaciones$: Observable<Publicacion[]>; // Un observable para las publicaciones

  constructor(
    private publicacionesService: PublicacionesService,
    private carritoService: CarritoService,
    private toastController: ToastController
  ) {
    // Inicializa el observable (aún no se suscribe)
    this.publicaciones$ = this.publicacionesService.getPublicaciones();
  }

  ngOnInit() {
  }

  /**
   * Llama al CarritoService para añadir un item
   */
  async agregarAlCarrito(pub: Publicacion, event: Event) {
    event.stopPropagation(); // Evita que el clic se propague a la card

    if (!pub.carta) {
      console.error('La publicación no tiene carta asociada:', pub);
      return;
    }

    const cartaParaCarrito: any = {
      ...pub.carta,
      // Campos "amigables" que usan las plantillas del carrito/lista de deseos
      id: pub.id_publicacion,
      precio: pub.precio,
      imagen: pub.carta.imagen_carta    
    };

    this.carritoService.addItem(cartaParaCarrito);

    // Muestra una notificación (Toast)
    const toast = await this.toastController.create({
      message: `${pub.carta.nombre} añadido al carrito`,
      duration: 1500,
      position: 'top',
      color: 'success'
    });
    toast.present();
  }

  verDetallePublicacion(pub: Publicacion) {
    if (!pub.carta) {
      console.log('Publicación sin carta asociada:', pub);
      return;
    }
    console.log('Navegar al detalle de:', pub.carta.nombre);
    // this.router.navigateByUrl(`/detalle-publicacion/${pub.id_publicacion}`);
  }
}

