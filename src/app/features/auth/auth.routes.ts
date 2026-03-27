import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login.component').then(m => m.LoginComponent),
    title: 'Sign in',
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
