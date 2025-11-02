import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonLoading
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewWillEnter() {
    this.isLoading = false; // Forza el "Cargando" a desaparecer
    this.error = null;      // Limpia errores antiguos
  }

  async register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    const userData = {
      nombre_usuario: this.registerForm.value.nombre,
      correo: this.registerForm.value.email,
      contraseña: this.registerForm.value.password,
      tipo_usuario: 'comprador' // Por defecto
    };

    this.usuarioService.register(userData).subscribe({
      next: async (res) => {
        this.isLoading = false;
        await this.mostrarToast('¡Cuenta creada! Ahora puedes iniciar sesión.', 'success');

        // ¡Como pediste! Redirige de vuelta al Login
        this.router.navigateByUrl('/login');
      },
      error: async (err) => {
        this.isLoading = false;
        this.error = err.error?.msg || 'Error al registrar la cuenta';
        if (this.error) {
          await this.mostrarToast(this.error, 'danger');
        }
      }
    });
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color
    });
    toast.present();
  }
}
