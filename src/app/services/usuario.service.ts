import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// Importamos el CarritoService
import { CarritoService } from './carrito.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = environment.apiUrl;
  public usuario: any | null = null;

  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);
  public isLogged = this.isLoggedInSubject.asObservable();

  public get isLoggedValue(): boolean {
    return this.isLoggedInSubject.value || false;
  }

  constructor(
    private http: HttpClient,
    private carritoService: CarritoService // Inyectamos el carrito
  ) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isLoggedInSubject.next(true);
      // Carga el perfil para obtener el ID y cargar el carrito
      this.getProfile().subscribe();
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.isLoggedInSubject.next(true);
        // Al loguear, cargamos el perfil para inicializar el carrito
        this.getProfile().subscribe();
      })
    );
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.usuario = null;
    this.isLoggedInSubject.next(false);

    // Limpiamos el carrito en memoria al salir
    this.carritoService.clearUserSession();
  }

  getProfile(): Observable<any> {
    if (this.usuario) {
      // Si ya tenemos el usuario, nos aseguramos de que el carrito esté inicializado con su ID
      this.carritoService.initCart(this.usuario.id_usuario);
      return of(this.usuario);
    }

    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });

    return this.http.get(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap((data: any) => {
        this.usuario = data;
        // Inicializamos el carrito con el ID del usuario obtenido
        if (data && data.id_usuario) {
          this.carritoService.initCart(data.id_usuario);
        }
      })
    );
  }

  getUsuario(): any | null {
    return this.usuario;
  }

  setUsuario(usuario: any) {
    this.usuario = usuario;
  }

  actualizarPerfil(data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });

    return this.http.put(`${this.apiUrl}/users/me`, data, { headers }).pipe(
      tap((res: any) => {
        this.usuario = res.user;
      })
    );
  }

  changePassword(body: { oldPassword: string; newPassword: string }): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });
    return this.http.put(`${this.apiUrl}/users/change-password`, body, { headers });
  }

  deletePerfil(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });

    return this.http.delete(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap(() => {
        this.logout();
      })
    );
  }
}
