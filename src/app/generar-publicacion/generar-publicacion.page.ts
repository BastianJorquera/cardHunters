import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSearchbar,
  IonButton,
  IonList,
  IonTextarea
} from '@ionic/angular/standalone';

import { PublicacionesService, Publicacion } from '../services/publicaciones.service';
import { CartasService, Carta } from '../services/cartas.service';

@Component({
  selector: 'app-generar-publicacion',
  templateUrl: './generar-publicacion.page.html',
  styleUrls: ['./generar-publicacion.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonSearchbar,
    IonButton,
    IonList,
    IonTextarea,
    RouterModule,
    CommonModule,
    FormsModule
  ]
})
export class GenerarPublicacionPage implements OnInit {

  cartas: Carta[] = [];

  textoBusqueda: string = '';
  idFranquiciaFiltro: number | null = null;

  // Campos del formulario
  cartaSeleccionadaId: number | null = null;
  precio: number | null = null;
  cantidad: number | null = 1;
  estado: string = '';

  misPublicaciones: Publicacion[] = [];

  constructor(
    private publicacionesService: PublicacionesService,
    private cartasService: CartasService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarCartas();
    this.cargarMisPublicaciones();
  }

  cargarCartasIniciales() {
    this.cartasService.getCartas().subscribe({
      next: (cartas) => {
        this.cartas = cartas;
      },
      error: (err) => {
        console.error('Error al cargar cartas:', err);
        alert('No se pudieron cargar las cartas.');
      }
    });
  }

  onBuscarCartas(event: any) {
    const value = event.detail?.value ?? '';
    this.textoBusqueda = value;

    // Si el texto está vacío, puedes:
    // a) volver a cargar todas las cartas, o
    // b) dejar la lista vacía.
    if (!this.textoBusqueda || this.textoBusqueda.trim().length === 0) {
      this.cargarCartasIniciales();
      return;
    }

    this.cartasService.buscarCartas(this.textoBusqueda, this.idFranquiciaFiltro ?? undefined)
      .subscribe({
        next: (cartas) => {
          this.cartas = cartas;
        },
        error: (err) => {
          console.error('Error en búsqueda de cartas:', err);
        }
      });
  }

  cargarCartas() {
    this.cartasService.getCartas().subscribe({
      next: (cartas) => {
        this.cartas = cartas;
      },
      error: (err) => {
        console.error('Error al cargar cartas:', err);
        alert('No se pudieron cargar las cartas.');
      }
    });
  }

  cargarMisPublicaciones() {
    this.publicacionesService.getMisPublicaciones().subscribe({
      next: (pubs) => {
        this.misPublicaciones = pubs;
      },
      error: (err) => {
        console.error('Error al cargar mis publicaciones:', err);
        // acá no alerto fuerte, solo log; es algo “extra”
      }
    });
  }

  crearPublicacion() {
    if (!this.cartaSeleccionadaId || !this.precio || !this.cantidad) {
      alert('Debes seleccionar una carta y completar precio y cantidad.');
      return;
    }

    const nuevaPub: Publicacion = {
      id_carta: this.cartaSeleccionadaId,
      precio: this.precio,
      cantidad: this.cantidad,
      estado: this.estado // observación
    };

    this.publicacionesService.crearPublicacion(nuevaPub).subscribe({
      next: (res) => {
        console.log('Publicación creada:', res);
        alert('Publicación creada correctamente.');
        // Recargo listado abajo para que el usuario vea su nueva publicación
        this.cargarMisPublicaciones();
        // Opcional: limpiar formulario después de publicar
        this.limpiarFormulario();
        // si quieres redirigir al catálogo, deja la línea:
        // this.router.navigateByUrl('/tabs/catalogo');
      },
      error: (err) => {
        console.error('Error al crear publicación', err);
        alert('Ocurrió un error al crear la publicación.');
      }
    });
  }

  limpiarFormulario() {
    this.cartaSeleccionadaId = null;
    this.precio = null;
    this.cantidad = 1;
    this.estado = '';
  }

}
