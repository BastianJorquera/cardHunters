import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// --- Interfaces ---
export interface CartaCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagenUrl: string;
  nombre_set?: string;
  estado?: string;
}
export interface CarritoItem {
  carta: CartaCarrito;
  cantidad: number;
}

export interface CarritoState {
  items: CarritoItem[];
  cantidadTotal: number;
  total: number;
}
// --- Fin Interfaces ---

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoSubject = new BehaviorSubject<CarritoState>({
    items: [],
    cantidadTotal: 0,
    total: 0
  });

  public carrito$ = this.carritoSubject.asObservable();

  // Guardamos el ID del usuario actual para la persistencia
  private currentUserId: string | number | null = null;
  private readonly STORAGE_KEY_PREFIX = 'cart_';

  constructor() {}

  /**
   * Inicializa el carrito para un usuario específico.
   * Se debe llamar al loguearse o al cargar la app si ya hay sesión.
   */
  initCart(userId: string | number) {
    this.currentUserId = userId;
    this.loadFromStorage();
  }

  /**
   * Limpia el usuario actual (logout) y vacía el estado en memoria.
   */
  clearUserSession() {
    this.currentUserId = null;
    // Reiniciamos el carrito en memoria (vacío)
    this.carritoSubject.next({
      items: [],
      cantidadTotal: 0,
      total: 0
    });
  }

  /**
   * Añade un item al carrito. (AHORA SOLO PERMITE CARTAS ÚNICAS)
   */
  addItem(carta: CartaCarrito) {
    const estadoActual = this.carritoSubject.value;
    const items = [...estadoActual.items];

    const itemExistente = items.find(i => i.carta.id === carta.id);

    if (itemExistente) {
      // CAMBIO: Como son cartas únicas, si ya existe, no hacemos nada (o podrías mostrar una alerta).
      console.log('Esta carta ya está en el carrito');
      return;
    } else {
      // Si es nuevo, lo añade con cantidad 1
      items.push({ carta: carta, cantidad: 1 });
    }

    this.actualizarSubject(items);
  }

  /**
   * Elimina un item del carrito.
   */
  removeItem(cartaId: number) {
    const items = this.carritoSubject.value.items.filter(i => i.carta.id !== cartaId);
    this.actualizarSubject(items);
  }

  /**
   * Vacía el carrito por completo.
   */
  clearCart() {
    this.actualizarSubject([]);
  }

  // --- Métodos Privados de Persistencia ---

  private actualizarSubject(items: CarritoItem[]) {
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);
    const total = items.reduce((sum, item) => sum + (item.carta.precio * item.cantidad), 0);

    const nuevoEstado: CarritoState = {
      items,
      cantidadTotal,
      total
    };

    this.carritoSubject.next(nuevoEstado);
    this.saveToStorage(nuevoEstado);
  }

  private saveToStorage(state: CarritoState) {
    // Solo guardamos si tenemos un usuario identificado
    if (this.currentUserId) {
      localStorage.setItem(`${this.STORAGE_KEY_PREFIX}${this.currentUserId}`, JSON.stringify(state));
    }
  }

  private loadFromStorage() {
    if (!this.currentUserId) return;

    const stored = localStorage.getItem(`${this.STORAGE_KEY_PREFIX}${this.currentUserId}`);
    if (stored) {
      try {
        const state = JSON.parse(stored);
        this.carritoSubject.next(state);
      } catch (e) {
        console.error('Error cargando carrito', e);
      }
    } else {
      // Si no hay nada guardado, empezamos vacíos
      this.carritoSubject.next({ items: [], cantidadTotal: 0, total: 0 });
    }
  }
}
