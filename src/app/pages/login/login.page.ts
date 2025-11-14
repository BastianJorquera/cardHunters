import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Usaremos Reactive Forms
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonText,
  IonLoading,
  ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonButtons,
    IonText,
    IonLoading
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  error: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ionViewWillEnter() {
    this.isLoading = false; // Forza el "Cargando" a desaparecer
    this.error = null;      // Limpia errores antiguos
  }

  async login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    // Mapea los nombres de tu formulario a los que espera el backend
    const credentials = {
      correo: this.loginForm.value.email,
      contraseña: this.loginForm.value.password
    };

    this.usuarioService.login(credentials).subscribe({
      next: async (res) => {
        this.isLoading = false;
        await this.mostrarToast('¡Bienvenido!', 'success');

        // Redirige a la página principal (Catálogo)
        // replaceUrl: true evita que pueda "volver" al login con el botón atrás
        this.router.navigateByUrl('/tabs/catalogo', { replaceUrl: true });
      },
      error: async (err) => {
        this.isLoading = false;
        this.error = err.error?.msg || 'Error desconocido al iniciar sesión';
        if (this.error) {
          await this.mostrarToast(this.error, 'danger');
        }
      }
    });
  }

  async mostrarToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    toast.present();
  }
}
