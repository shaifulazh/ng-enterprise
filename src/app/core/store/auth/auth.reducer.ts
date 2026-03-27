import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState, initialAuthState } from './auth.state';

export const authReducer = createReducer<AuthState>(
  initialAuthState,

  on(AuthActions.loginStart, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(AuthActions.setPkceVerifier, (state, { verifier }) => ({
    ...state,
    pkceVerifier: verifier,
  })),

  on(AuthActions.exchangeCodeForToken, (state,{code,callbackState}) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(AuthActions.exchangeCodeForTokenSuccess, (state, { accessToken, expiresIn, user }) => ({
    ...state,
    accessToken,
    tokenExpiresAt: Date.now() + expiresIn * 1000,
    user,
    status:       'authenticated' as const,
    error:        null,
    pkceVerifier: null, // clear after use
  })),

  on(AuthActions.exchangeCodeForTokenFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  })),

  on(AuthActions.refreshToken, (state) => ({
    ...state,
    status: 'refreshing' as const,
  })),

  on(AuthActions.refreshTokenSuccess, (state, { accessToken, expiresIn }) => ({
    ...state,
    accessToken,
    tokenExpiresAt: Date.now() + expiresIn * 1000,
    status: 'authenticated' as const,
    error: null,
  })),

  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    accessToken:    null,
    tokenExpiresAt: null,
    user:           null,
    status:         'error' as const,
    error,
  })),

  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.logout, AuthActions.logoutSuccess, () => ({
    ...initialAuthState,
    status: 'idle' as const,
  })),

  on(AuthActions.sessionExpired, (state) => ({
    ...state,
    accessToken:    null,
    tokenExpiresAt: null,
    status:         'idle' as const,
  })),
);
