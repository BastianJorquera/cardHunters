import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { ListaDeseosService, ListaDeseosState, DeseoItem } from '../services/lista-deseos.service';
import { addIcons } from 'ionicons';
import { heartDislikeOutline, trashOutline } from 'ionicons/icons';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-lista-deseos',
  templateUrl: './lista-deseos.page.html',
  styleUrls: ['./lista-deseos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    RouterModule,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonIcon,
    IonFooter
  ]
})
export class ListaDeseosPage implements OnInit {

  public listaDeseos$: Observable<ListaDeseosState>;

  constructor(private listaDeseosService: ListaDeseosService) {
    this.listaDeseos$ = this.listaDeseosService.listaDeseos$;
    addIcons({ heartDislikeOutline, trashOutline });
  }

  ngOnInit() {}

  quitarDeDeseos(item: DeseoItem) {
    this.listaDeseosService.removeItem(item.carta.id);
  }

  vaciarLista() {
    this.listaDeseosService.clearList();
  }

}
