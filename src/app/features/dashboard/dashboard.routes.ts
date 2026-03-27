import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dashboardReducer } from './store/dashboard.reducer';
import { DashboardEffects } from './store/dashboard.effects';
import { DashboardApiService } from './services/dashboard-api.service';

export const dashboardRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('dashboard', dashboardReducer),
      provideEffects(DashboardEffects),
      DashboardApiService,
    ],
    loadComponent: () =>
      import('./components/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard',
  },
];
