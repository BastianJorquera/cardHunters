import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Define tu interfaz de Carta aquí o en 'models'
// (Puedes mover esto a un archivo 'models/carta.interface.ts' luego)
export interface Carta {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  juego: 'Pokemon' | 'YuGiOh' | 'Magic';
}

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  // --- DATOS EN DURO ---
  private mockCartas: Carta[] = [
    { id: 1, nombre: 'Pikachu VMAX', precio: 15000, imagen: 'https://placehold.co/200x280/F7DE3E/000000?text=Pikachu', juego: 'Pokemon' },
    { id: 2, nombre: 'Mago Oscuro', precio: 10000, imagen: 'https://placehold.co/200x280/2A0F46/FFFFFF?text=Mago+Oscuro', juego: 'YuGiOh' },
    { id: 3, nombre: 'Black Lotus', precio: 99990, imagen: 'https://placehold.co/200x280/111111/FFFFFF?text=Black+Lotus', juego: 'Magic' },
    { id: 4, nombre: 'Charizard Brillante', precio: 50000, imagen: 'https://placehold.co/200x280/E87A38/FFFFFF?text=Charizard', juego: 'Pokemon' },
    { id: 5, nombre: 'Dragón Blanco de Ojos Azules', precio: 25000, imagen: 'https://placehold.co/200x280/A0D0EF/000000?text=Dragon+Blanco', juego: 'YuGiOh' },
    { id: 6, nombre: 'Jace, el Escultor Mental', precio: 30000, imagen: 'https://placehold.co/200x280/3A8DDE/FFFFFF?text=Jace', juego: 'Magic' },
  ];
  // ---------------------

  constructor() { }

  /**
   * Devuelve los datos en duro como un Observable (simulando una API)
   */
  getCartas(): Observable<Carta[]> {
    return of(this.mockCartas);
  }
}

