import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-cambio-contrasena',
  templateUrl: './cambio-contrasena.page.html',
  styleUrls: ['./cambio-contrasena.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonSpinner,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class CambioContrasenaPage implements OnInit {

  usuario: any = null; // si después quieres mostrar datos del usuario
  loading = false;
  errorMsg = '';
  successMsg = '';

  form = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
  }

  private async presentSuccessToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,         // 3 segundos
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async onChangePassword() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.form.oldPassword || !this.form.newPassword || !this.form.confirmPassword) {
      this.errorMsg = 'Complete todos los campos.';
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.errorMsg = 'Las nuevas contraseñas no coinciden.';
      return;
    }

    if (this.form.newPassword.length < 6) {
      this.errorMsg = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }

    this.loading = true;

    this.usuarioService
      .changePassword({
        oldPassword: this.form.oldPassword,
        newPassword: this.form.newPassword,
      })
      .subscribe({
        next: async (res: any) => {
          const message = res?.msg || 'Contraseña actualizada correctamente.';
          this.successMsg = message;
          this.form.oldPassword = '';
          this.form.newPassword = '';
          this.form.confirmPassword = '';
          this.loading = false;
          
          await this.presentSuccessToast(message);

          this.router.navigate(['../editar-perfil']);
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err?.error?.msg || 'No se pudo cambiar la contraseña.';
        }
      });
  }
}

