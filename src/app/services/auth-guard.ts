import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from './usuario.service';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  canActivate(): boolean {

    // Usamos el getter síncrono que creamos
    const isLogged = this.usuarioService.isLoggedValue;

    if (isLogged) {
      return true; // Sí, puede pasar
    } else {
      // No, no puede pasar. Redirige a /login
      this.mostrarToast('Debes iniciar sesión para ver tu perfil', 'warning');
      this.router.navigateByUrl('/login');
      return false;
    }
  }

  async mostrarToast(mensaje: string, color: 'warning' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}
