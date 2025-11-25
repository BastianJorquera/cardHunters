import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Carta } from './cartas.service';

export interface Publicacion {
  id_publicacion?: number;
  id_usuario?: number;
  id_carta: number;
  precio: number;
  cantidad: number;
  estado: string;        // Se usa como comentario de observación
  fecha_publicacion?: string;

  carta?: Carta;  // Datos de la carta (opcional, para facilitar)
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private apiUrl = `${environment.apiUrl}/publicaciones`;

  constructor(private http: HttpClient) {}

  //construye headers con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') || '';
    return new HttpHeaders({
      'x-auth-token': token,
      'Content-Type': 'application/json'
    });
  }

  //======================
  // METODOS PRINCIPALES
  //======================

  //(GET /api/publicaciones)
  getPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(this.apiUrl);
  }

  //(POST /api/publicaciones)
  crearPublicacion(pub: Publicacion): Observable<Publicacion> {
    const headers = this.getAuthHeaders();
    return this.http.post<Publicacion>(this.apiUrl, pub, { headers });
  }

  //(GET /api/publicaciones/mias)
  getMisPublicaciones(): Observable<Publicacion[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Publicacion[]>(`${this.apiUrl}/mias`, { headers });
  }

  //(GET /api/publicaciones/:id)
  getPublicacionById(id_publicacion: number): Observable<Publicacion> {
    const headers = this.getAuthHeaders();
    return this.http.get<Publicacion>(`${this.apiUrl}/${id_publicacion}`, { headers });
  }

  //(PUT /api/publicaciones/:id)
  actualizarPublicacion(
    id_publicacion: number,
    data: Partial<Publicacion>
  ): Observable<Publicacion> {
    const headers = this.getAuthHeaders();
    return this.http.put<Publicacion>(`${this.apiUrl}/${id_publicacion}`, data, { headers });
  }

  //(DELETE /api/publicaciones/:id)
  eliminarPublicacion(id_publicacion: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/${id_publicacion}`, { headers });
  }

}
