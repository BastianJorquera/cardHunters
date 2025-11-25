import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Carta {
  id_carta: number;
  nombre: string;
  rareza: string;
  tipo: string;
  id_franquicia: number;
  imagen_carta: string;
  id_api_externa?: string | null;
  nombre_set?: string | null;
  numero_carta?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CartasService {

  private apiUrl = `${environment.apiUrl}/cartas`;

  /*/ --- DATOS EN DURO ---
  private mockCartas: Carta[] = [
    { id: 1, nombre: 'Pikachu VMAX', precio: 15000, imagen: 'https://placehold.co/200x280/F7DE3E/000000?text=Pikachu', juego: 'Pokemon' },
    { id: 2, nombre: 'Mago Oscuro', precio: 10000, imagen: 'https://placehold.co/200x280/2A0F46/FFFFFF?text=Mago+Oscuro', juego: 'YuGiOh' },
    { id: 3, nombre: 'Black Lotus', precio: 99990, imagen: 'https://placehold.co/200x280/111111/FFFFFF?text=Black+Lotus', juego: 'Magic' },
    { id: 4, nombre: 'Charizard Brillante', precio: 50000, imagen: 'https://placehold.co/200x280/E87A38/FFFFFF?text=Charizard', juego: 'Pokemon' },
    { id: 5, nombre: 'Dragón Blanco de Ojos Azules', precio: 25000, imagen: 'https://placehold.co/200x280/A0D0EF/000000?text=Dragon+Blanco', juego: 'YuGiOh' },
    { id: 6, nombre: 'Jace, el Escultor Mental', precio: 30000, imagen: 'https://placehold.co/200x280/3A8DDE/FFFFFF?text=Jace', juego: 'Magic' },
  ];
  // ---------------------*/

  constructor(private http: HttpClient) { }

//(GET /api/cartas)
  getCartas(): Observable<Carta[]> {
    return this.http.get<Carta[]>(this.apiUrl);
  }

  //(GET /api/cartas/:id)
  getCartaById(id_carta: number): Observable<Carta> {
    return this.http.get<Carta>(`${this.apiUrl}/${id_carta}`);
  }

  //(GET /api/cartas/search?nombre=...&franquicia=...)
  buscarCartas(nombre: string, id_franquicia?: number): Observable<Carta[]> {
    const params: any = {};

    if (nombre && nombre.trim().length > 0) {
      params.nombre = nombre.trim();
    }

    if (id_franquicia !== undefined && id_franquicia !== null) {
      params.franquicia = id_franquicia;
    }

    return this.http.get<Carta[]>(`${this.apiUrl}/search`, { params });
  }
  
}

