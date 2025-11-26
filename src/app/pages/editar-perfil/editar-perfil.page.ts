import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

import { IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonAvatar,
  IonItem,
  IonCard,
  IonCardHeader,
  IonButton,
  IonLabel,
  IonList
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    RouterModule,
    IonAvatar,
    IonItem,
    IonCardHeader,
    IonCard,
    IonButton,
    IonLabel,
    IonList,
    IonButtons
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditarPerfilPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public usuario: any | null = null;
  public usuarioEditable: any | null = null;

  public passwordActual: string = '';
  public passwordNueva: string = '';

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
  this.usuario = this.usuarioService.getUsuario();
  this.usuarioEditable = { ...this.usuario };

    if (!this.usuario) {
      this.usuarioService.getProfile().subscribe({
        next: (data: any) => {
          this.usuario = data;
          this.usuarioEditable = { ...data };
          this.usuarioService.setUsuario(data);
        },
        error: (err: any) => {
          console.error('Error al cargar el usuario:', err);
        }
      });
    }
  }

  onClickCambiarFoto() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string; // ej: "data:image/png;base64,AAAA..."
      // guardamos en usuarioEditable para enviarlo al backend al guardar
      this.usuarioEditable.foto_perfil = base64;
    };
    reader.readAsDataURL(file);
  }

  guardarCambios() {
    console.log("Nombre editado:", this.usuarioEditable.nombre_usuario);
    const payload = {...this.usuarioEditable };

      // Si el usuario no ingresó nada → mantener el valor anterior
    if (!payload.nombre_usuario || payload.nombre_usuario.trim() === "") {
      payload.nombre_usuario = this.usuario.nombre_usuario;
    }

    if (!payload.correo || payload.correo.trim() === "") {
      payload.correo = this.usuario.correo;
    }

    console.log('datos enviados al backend', payload);

    this.usuarioService.actualizarPerfil(payload)
    .subscribe({
      next: (res) => {
        console.log('RESPUESTA BACKEND', res);

        //Actualiza también el usuario en el servicio
        this.usuario = res.user;
        this.usuarioEditable = { ...res.user };

        this.usuarioService.setUsuario(res.user);

        alert('Perfil actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        alert('Error al actualizar el perfil.');
      }
    });
  }

  confirmarEliminar() {
    const confirmar = confirm('¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (confirmar) {
      this.eliminarCuenta();
    }
  }

  eliminarCuenta() {
    console.log('Eliminando cuenta...');

    this.usuarioService.deletePerfil().subscribe({
      next: () => {
        alert('Cuenta eliminada correctamente.');
        window.location.href = '/login';
      },
      error: (err) => {
        console.error('Error al eliminar cuenta:', err);
        alert('No se pudo eliminar la cuenta :( Intenta nuevamente');
      }
    });

  }

}
