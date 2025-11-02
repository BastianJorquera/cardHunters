import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage),
  },
  {
    // Esta es la ruta principal de tu app (las pestañas)
    // Se carga en la ruta '/tabs'
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    // Ruta por defecto: redirige a '/tabs'
    // (que a su vez redirigirá a '/tabs/catalogo')
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
];

