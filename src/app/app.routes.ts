import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // 

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', //Ahora iniciará en la página de login
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage),
    canActivate: [authGuard] // <--- PROTEGIDO
  },
  {
    path: 'historial',
    loadComponent: () => import('./pages/historial/historial.page').then( m => m.HistorialPage),
    canActivate: [authGuard] // <--- PROTEGIDO
  },
];
