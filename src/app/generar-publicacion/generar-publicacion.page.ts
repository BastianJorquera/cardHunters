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
  IonTextarea,
  ToastController
} from '@ionic/angular/standalone';

import { PublicacionesService, Publicacion } from '../services/publicaciones.service';
import { CartasService, Carta } from '../services/cartas.service';
import { UsuarioService } from '../services/usuario.service';

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
    FormsModule,
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
    private router: Router,
    private usuarioService: UsuarioService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    //valido si hay usuario logeado
    if (!this.usuarioService.isLoggedValue) {
      const toast = await this.toastController.create({
        message: 'Debes iniciar sesión para generar una publicación.',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();

      this.router.navigateByUrl('/login');
    }

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
      }
    });
  }

  async crearPublicacion() {
    // Doble seguridad: por si alguien entra por URL o cambia cosas en runtime
    if (!this.usuarioService.isLoggedValue) {
      const toast = await this.toastController.create({
        message: 'Debes iniciar sesión para crear una publicación.',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      this.router.navigateByUrl('/login');
      return;
    }

    if (!this.cartaSeleccionadaId || !this.precio || !this.cantidad) {
      alert('Debes seleccionar una carta y completar precio y cantidad.');
      return;
    }

    const nuevaPub: Publicacion = {
      id_carta: this.cartaSeleccionadaId,
      precio: this.precio,
      cantidad: this.cantidad,
      estado: this.estado
    };

    this.publicacionesService.crearPublicacion(nuevaPub).subscribe({
      next: async (res) => {
        console.log('Publicación creada:', res);

        const toast = await this.toastController.create({
          message: 'Publicación creada correctamente.',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        this.cargarMisPublicaciones();
        this.limpiarFormulario();
      },
      error: async (err) => {
        console.error('Error al crear publicación', err);

        const toast = await this.toastController.create({
          message: 'Ocurrió un error al crear la publicación.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
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
