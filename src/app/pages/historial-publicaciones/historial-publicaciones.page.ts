import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonThumbnail,
  IonIcon,
  IonSpinner,
  AlertController,
  ToastController,
  IonInput,
  IonTextarea
} from '@ionic/angular/standalone';

import { PublicacionesService, Publicacion } from '../../services/publicaciones.service';
import { UsuarioService } from '../../services/usuario.service';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-historial-publicaciones',
  templateUrl: './historial-publicaciones.page.html',
  styleUrls: ['./historial-publicaciones.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
    IonThumbnail,
    IonIcon,
    IonSpinner,
    IonInput,
    IonTextarea
  ]
})
export class HistorialPublicacionesPage implements OnInit {

  misPublicaciones: Publicacion[] = [];
  cargando = true;

  constructor(
    private publicacionesService: PublicacionesService,
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ trashOutline });
  }

  async ngOnInit() {
    // Seguridad básica: si no está logeado, lo mandamos a login
    if (!this.usuarioService.isLoggedValue) {
      const toast = await this.toastController.create({
        message: 'Debes iniciar sesión para ver tus publicaciones.',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      this.router.navigateByUrl('/login');
      return;
    }

    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones() {
    this.cargando = true;
    this.publicacionesService.getMisPublicaciones().subscribe({
      next: (pubs: Publicacion[]) => {
        this.misPublicaciones = pubs;
        this.cargando = false;
      },
      error: async (err: any) => {
        console.error('Error al cargar mis publicaciones:', err);
        this.cargando = false;
        const toast = await this.toastController.create({
          message: 'No se pudieron cargar tus publicaciones.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async confirmarEliminar(pub: Publicacion) {
    const alert = await this.alertController.create({
      header: 'Eliminar publicación',
      message: `¿Seguro que quieres eliminar la publicación de "${pub.carta?.nombre || 'Carta ID ' + pub.id_carta}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (pub.id_publicacion) {
              this.eliminarPublicacion(pub.id_publicacion);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarPublicacion(id_publicacion: number) {
    this.publicacionesService.eliminarPublicacion(id_publicacion).subscribe({
      next: async () => {
        // Quitamos la publicación del array sin tener que recargar todo
        this.misPublicaciones = this.misPublicaciones.filter(
          p => p.id_publicacion !== id_publicacion
        );

        const toast = await this.toastController.create({
          message: 'Publicación eliminada correctamente.',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
      },
      error: async (err: any) => {
        console.error('Error al eliminar publicación:', err);

        const toast = await this.toastController.create({
          message: 'No se pudo eliminar la publicación.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  empezarEditar(pub: Publicacion) {
    this.publicacionEditandoId = pub.id_publicacion ?? null;
  }

  cancelarEdicion() {
    this.publicacionEditandoId = null;
  }

  async guardarCambios(pub: Publicacion) {
    if (!pub.id_publicacion) {
      console.error('La publicación no tiene id_publicacion, no se puede actualizar.');
      return;
    }

    const payload = {
      precio: pub.precio,
      cantidad: pub.cantidad,
      estado: pub.estado
    };

    this.publicacionesService.actualizarPublicacion(pub.id_publicacion, payload).subscribe({
      next: async (pubActualizada: Publicacion) => {
        
        // Actualizamos el array local con la respuesta del backend
        this.misPublicaciones = this.misPublicaciones.map(p =>
          p.id_publicacion === pubActualizada.id_publicacion ? pubActualizada : p
        );

        const toast = await this.toastController.create({
          message: 'Publicación actualizada correctamente.',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        this.publicacionEditandoId = null;
      },
      error: async (err: any) => {
        console.error('Error al actualizar publicación:', err);
        const toast = await this.toastController.create({
          message: 'No se pudieron guardar los cambios.',
          duration: 2000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }


  publicacionEditandoId: number | null = null;

}