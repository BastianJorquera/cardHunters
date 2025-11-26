import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bookOutline, cartOutline, personOutline, heartOutline, storefrontOutline } from 'ionicons/icons';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel],
})
export class TabsPage {
  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ bookOutline, cartOutline, personOutline, heartOutline, storefrontOutline });
  }

  async onGenerarPublicacionClick() {
    const isLogged = this.usuarioService.isLoggedValue;

    if (!isLogged) {
      const toast = await this.toastController.create({
        message: 'Debes iniciar sesión para generar una publicación.',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    this.router.navigateByUrl('/tabs/generar-publicacion');
  }
}

