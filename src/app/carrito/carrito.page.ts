import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CarritoService, CarritoState, CarritoItem } from '../services/carrito.service';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
// --- ¡ARREGLO 1: Importamos los componentes de Ionic uno por uno! ---
import {
  IonContent,
  IonIcon,
  IonButton,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonFooter,
  IonToolbar,
  AlertController, // Se inyecta
  ToastController  // Se inyecta
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, cartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-carrito',
  templateUrl: 'carrito.page.html',
  styleUrls: ['carrito.page.scss'],
  standalone: true,
  // --- ¡ARREGLO 1: Añadimos los componentes al array de imports! ---
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    IonContent,
    IonIcon,
    IonButton,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonFooter,
    IonToolbar
  ],
})
export class CarritoPage {

  public carrito$: Observable<CarritoState>;
  public isLoggedIn$: Observable<boolean | null>;

  constructor(
    private carritoService: CarritoService,
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    // "Escuchamos" el estado del carrito
    this.carrito$ = this.carritoService.carrito$;
    // "Escuchamos" el estado del login
    this.isLoggedIn$ = this.usuarioService.isLogged;

    addIcons({ trashOutline, cartOutline });
  }

  // --- Métodos de Interacción del Carrito ---

async eliminarItem(cartaId: number) {
    const alert = await this.alertController.create({
      header: 'Eliminar producto',
      message: '¿Estás seguro de que deseas eliminar esta carta del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // El usuario canceló, no hacemos nada
            console.log('Eliminación cancelada');
          }
        },
        {
          text: 'Eliminar',
          role: 'destructive', // En iOS esto lo pone rojo automáticamente
          handler: () => {
            // El usuario confirmó, procedemos a borrar
            this.carritoService.removeItem(cartaId);
            this.mostrarToast('Producto eliminado');
          }
        }
      ]
    });

    await alert.present();
  }

  async vaciarCarrito() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres vaciar el carrito?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Vaciar',
          handler: () => {
            this.carritoService.clearCart(); // ¡Ahora esta función existe!
            this.mostrarToast('Carrito vaciado');
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Lógica clave de tu E-Commerce.
   * Revisa si el usuario está logueado antes de pagar.
   */
  procederAlPago() {
    // --- ARREGLO 2: Usamos el getter 'isLoggedValue' ---
    const logueado = this.usuarioService.isLoggedValue;

    if (logueado) {
      // 1. SI ESTÁ LOGUEADO: Simula el pago
      this.simularPago();
    } else {
      // 2. NO ESTÁ LOGUEADO: Redirige a /login
      this.mostrarAlertaLogin();
    }
  }

  async simularPago() {
    const alert = await this.alertController.create({
      header: '¡Pago Exitoso!',
      message: 'Tu compra ha sido procesada (simulación).',
      buttons: ['OK']
    });
    await alert.present();
    // this.carritoService.clearCart(); // Descomenta para vaciar el carrito después de pagar
  }

  async mostrarAlertaLogin() {
    const alert = await this.alertController.create({
      header: 'Inicio de Sesión Requerido',
      message: 'Debes iniciar sesión para poder realizar la compra.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Iniciar Sesión',
          handler: () => {
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom',
      color: 'dark' // Usa el color oscuro
    });
    toast.present();
  }
}

