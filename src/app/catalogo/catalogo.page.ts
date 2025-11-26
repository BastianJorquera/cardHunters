import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs'; // <--- Agregamos BehaviorSubject y combineLatest
import { map } from 'rxjs/operators'; // <--- Agregamos map
import { PublicacionesService, Publicacion } from '../services/publicaciones.service';
import { CarritoService } from '../services/carrito.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';

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
  IonSearchbar, // <--- Importante: Importar el componente Searchbar
  IonToolbar,   // <--- Opcional: para que se vea mejor en el header
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-catalogo',
  templateUrl: 'catalogo.page.html',
  styleUrls: ['catalogo.page.scss'],
  standalone: true,
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
    IonSpinner,
    IonSearchbar,
    IonToolbar
  ],
})
export class CatalogoPage implements OnInit {

  // Observable final filtrado que usará el HTML
  public publicaciones$: Observable<Publicacion[]>;

  // Un Subject para controlar el término de búsqueda actual
  private searchTerm$ = new BehaviorSubject<string>('');

  constructor(
    private publicacionesService: PublicacionesService,
    private carritoService: CarritoService,
    private toastController: ToastController
  ) {
    // combineLatest para escuchar dos cosas a la vez:
    // 1. La respuesta de la API (getPublicaciones)
    // 2. Los cambios en la barra de búsqueda (searchTerm$)
    this.publicaciones$ = combineLatest([
      this.publicacionesService.getPublicaciones(),
      this.searchTerm$
    ]).pipe(
      map(([publicaciones, term]) => {
        // Si no hay término de búsqueda, devolvemos todo
        if (!term || term.trim() === '') {
          return publicaciones;
        }

        // Si hay texto, filtramos
        const lowerTerm = term.toLowerCase();
        return publicaciones.filter(pub => {
          const nombreCarta = pub.carta?.nombre?.toLowerCase() || '';
          const nombreSet = pub.carta?.nombre_set?.toLowerCase() || '';
          const rareza = pub.carta?.rareza?.toLowerCase() || '';

          // Filtramos si el término coincide con el Nombre, el Set o la Rareza
          return nombreCarta.includes(lowerTerm) ||
                 nombreSet.includes(lowerTerm) ||
                 rareza.includes(lowerTerm);
        });
      })
    );
  }

  ngOnInit() {}

  // Método que se ejecuta cada vez que el usuario escribe en el buscador
  onSearchChange(event: any) {
    const valor = event.detail.value;
    this.searchTerm$.next(valor); // Actualiza el Subject
  }

  async agregarAlCarrito(pub: Publicacion, event: Event) {
    event.stopPropagation();
    if (!pub.carta) return;

    const cartaParaCarrito: any = {
      ...pub.carta,
      id: pub.id_publicacion,
      precio: pub.precio,
      imagen: pub.carta.imagen_carta,
      imagenUrl: pub.carta.imagen_carta,
      nombre_set: pub.carta.nombre_set,
      estado: pub.estado
    };

    this.carritoService.addItem(cartaParaCarrito);

    const toast = await this.toastController.create({
      message: `${pub.carta.nombre} añadido al carrito`,
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });
    toast.present();
  }

  verDetallePublicacion(pub: Publicacion) {
    console.log('Ver detalle', pub);
  }
}
