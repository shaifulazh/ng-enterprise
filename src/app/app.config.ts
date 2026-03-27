import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { appRoutes } from './app.routes';
import { authReducer } from './core/store/auth/auth.reducer';
import { layoutReducer } from './core/store/layout/layout.reducer';
import { settingsReducer } from './core/store/settings/settings.reducer';
import { routerReducer } from '@ngrx/router-store';
import { AuthEffects } from './core/store/auth/auth.effects';
import { SettingsEffects } from './core/store/settings/settings.effects';
import { CustomRouterSerializer } from './core/store/router/router.serializer';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
    ),

    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),

    provideStore({
      router:   routerReducer,
      auth:     authReducer,
      layout:   layoutReducer,
      settings: settingsReducer,
    }),

    provideEffects([
      AuthEffects,
      SettingsEffects,
    ]),

    provideRouterStore({
      serializer: CustomRouterSerializer,
    }),

    provideStoreDevtools({
      maxAge: 50,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
