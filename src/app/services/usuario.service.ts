import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = environment.apiUrl;
  
  // guarda los datos de usuario
  public usuario: any | null = null;

  // 1. El "Estado" privado. Un BehaviorSubject guarda el valor actual.
  //    Comienza como 'null' (cargando)
  private isLoggedInSubject = new BehaviorSubject<boolean | null>(null);

  // 2. El "Observable" público. Los componentes (Header, Perfil) se suscriben a esto.
  public isLogged = this.isLoggedInSubject.asObservable();

  // 3. Un GETTER PÚBLICO para obtener el valor actual síncrono.
  // ¡ESTA ES LA LÍNEA QUE ARREGLA TU ERROR!
  public get isLoggedValue(): boolean {
    // Devuelve 'false' si es 'null' (cargando) o 'false'
    return this.isLoggedInSubject.value || false;
  }

  constructor(private http: HttpClient) {
    // Al iniciar el servicio, revisa si hay un token en el storage.
    this.checkToken();
  }

  /**
   * Revisa si hay un token en localStorage y actualiza el estado.
   */
  private checkToken() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Aquí podrías añadir una llamada a 'getProfile' para validar el token.
      // Por ahora, si hay token, asumimos que está logueado.
      this.isLoggedInSubject.next(true);
    } else {
      this.isLoggedInSubject.next(false);
    }
  }

  /**
   * Registra un nuevo usuario.
   * No guarda el token, requiere que el usuario inicie sesión.
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, userData);
  }

  /**
   * Inicia sesión, guarda el token y notifica a los suscriptores.
   */
  login(credentials: any): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        // Guarda el token
        localStorage.setItem('auth_token', response.token);
        // Notifica a todos los suscriptores que el estado cambió a 'true'
        this.isLoggedInSubject.next(true);
      })
    );
  }

  /**
   * Cierra sesión, borra el token y notifica a los suscriptores.
   */
  logout() {
    localStorage.removeItem('auth_token');
    // Notifica a todos los suscriptores que el estado cambió a 'false' y eliminamos usuario guardado
    this.usuario = null;
    this.isLoggedInSubject.next(false);
  }

  /**
   * Obtiene el perfil del usuario usando el token guardado.
   */
  getProfile(): Observable<any> {
    if (this.usuario) {
      return of(this.usuario); // devuelve directamente si ya lo tenemos
    }

    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });

    return this.http.get(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap((data) => {
        this.usuario = data; // guardamos en memoria para reutilizar
      })
    );
  }

  //acceder a usuario en otras paginas
  getUsuario(): any | null {
    return this.usuario;
  }
  
  //actualizar usuario en otras paginas
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
        // Actualiza el usuario almacenado localmente
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
    console.log('TOKEN EN FRONT AL ELIMINAR:', token); // <-- prueba

    const headers = new HttpHeaders({
      'x-auth-token': token || ''
    });

    return this.http.delete(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap(() => {
        // limpiar info local
        this.logout();
      })
    );
  }
  
}

