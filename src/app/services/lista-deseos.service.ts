import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carta } from './cartas.service';

//INTERFACE
export interface CartaDeseo {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export interface DeseoItem{
  carta: CartaDeseo;
}

export interface ListaDeseosState {
  items: DeseoItem[];
}

//SERVICE

@Injectable({
  providedIn: 'root',
})
export class ListaDeseosService {
  //ESTADO INTERNO
  private listaDeseosSubject = new BehaviorSubject<ListaDeseosState>({
    items: []
  });

  //OBSERVABLE PUBLICO
  public listaDeseos$: Observable<ListaDeseosState> = this.listaDeseosSubject.asObservable();


  constructor() {
    //MODIFICAR LUEGO PARA LOCAL STORAGE
  }

  //añadir item
  addItem(carta: CartaDeseo) {
    const estadoActual = this.listaDeseosSubject.value;
    const items = [...estadoActual.items];

    const yaExiste = items.some(i => i.carta.id === carta.id);
    if (!yaExiste) {
      items.push({ carta });
      this.actualizarEstado(items);
    }
  }

  //qiuitar item
  removeItem(cartaId: number) {
    const items = this.listaDeseosSubject.value.items.filter(
      i => i.carta.id !== cartaId
    );
    this.actualizarEstado(items);
  }

  //vaciar lista
  clearList() {
    this.actualizarEstado([]);
  }

  private actualizarEstado(items: DeseoItem[]) {
    const nuevoEstado: ListaDeseosState = {
      items
    };

    this.listaDeseosSubject.next(nuevoEstado);
  }
}
