import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/auth-guard'; // <-- 1. Importa el Guardia

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'catalogo', // Ruta pública
        loadComponent: () =>
          import('../catalogo/catalogo.page').then((m) => m.CatalogoPage),
      },
      {
        path: 'carrito', // Ruta pública
        loadComponent: () =>
          import('../carrito/carrito.page').then((m) => m.CarritoPage),
      },
      {
        path: 'perfil', // <-- RUTA PROTEGIDA
        loadComponent: () =>
          import('../perfil/perfil.page').then((m) => m.PerfilPage),
        canActivate: [AuthGuard] // <-- 2. Aplica el Guardia
      },
      {
        path: '',
        redirectTo: 'catalogo',
        pathMatch: 'full',
      },
    ],
  },
];
