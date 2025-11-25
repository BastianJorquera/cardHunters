import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// --- Interfaces (Mantenidas aquí para simplicidad) ---
export interface CartaCarrito{
  id: number;     //ID para el carrito
  nombre: string;
  precio: number;
  imagenUrl: string;
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

  // 1. El "Estado" privado.
  private carritoSubject = new BehaviorSubject<CarritoState>({
    items: [],
    cantidadTotal: 0,
    total: 0
  });

  // 2. El "Observable" público. Los componentes se suscriben a esto.
  public carrito$ = this.carritoSubject.asObservable();

  constructor() {}

  /**
   * Añade un item al carrito.
   */
  addItem(carta: CartaCarrito) {
    const estadoActual = this.carritoSubject.value; // Obtiene el valor actual
    const items = [...estadoActual.items]; // Copia los items

    const itemExistente = items.find(i => i.carta.id === carta.id);

    if (itemExistente) {
      // Si existe, solo aumenta la cantidad
      itemExistente.cantidad++;
    } else {
      // Si es nuevo, lo añade al array
      items.push({ carta: carta, cantidad: 1 });
    }

    this.actualizarSubject(items);
  }

  /**
   * Actualiza la cantidad de un item.
   */
  updateItemQuantity(cartaId: number, nuevaCantidad: number) {
    const items = [...this.carritoSubject.value.items];
    const itemIndex = items.findIndex(i => i.carta.id === cartaId);

    if (itemIndex > -1) {
      if (nuevaCantidad > 0) {
        items[itemIndex].cantidad = nuevaCantidad;
      } else {
        // Si la cantidad es 0 o menos, elimina el item
        items.splice(itemIndex, 1);
      }
      this.actualizarSubject(items);
    }
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
  clearCart() { // <-- ARREGLO 3: AÑADIDA ESTA FUNCIÓN
    this.actualizarSubject([]);
  }

  /**
   * Método privado para recalcular totales y notificar a los suscriptores.
   */
  private actualizarSubject(items: CarritoItem[]) {
    // Calcula los nuevos totales
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);
    const total = items.reduce((sum, item) => sum + (item.carta.precio * item.cantidad), 0);

    // Crea el nuevo estado
    const nuevoEstado: CarritoState = {
      items: items,
      cantidadTotal: cantidadTotal,
      total: total
    };

    // Notifica a todos los suscriptores con el nuevo estado
    this.carritoSubject.next(nuevoEstado);
  }
}

