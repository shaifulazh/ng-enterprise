import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LayoutShellComponent } from './shared/layout/layout-shell.component';

export const appRoutes: Routes = [
  {
    path: 'callback',
    loadComponent: () =>
      import('./core/components/callback/callback.component')
        .then(m => m.CallbackComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: '',
    component: LayoutShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes')
            .then(m => m.dashboardRoutes),
      },
      {
        path: 'module-a',
        loadChildren: () =>
          import('./features/module-a/module-a.routes')
            .then(m => m.moduleARoutes),
      },
      {
        path: 'module-b',
        loadChildren: () =>
          import('./features/module-b/module-b.routes')
            .then(m => m.moduleBRoutes),
      },
      {
        path: 'module-c',
        loadChildren: () =>
          import('./features/module-c/module-c.routes')
            .then(m => m.moduleCRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.route')
            .then(m=>m.profileRoutes)
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
