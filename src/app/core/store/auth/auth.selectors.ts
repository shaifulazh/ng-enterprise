import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser            = createSelector(selectAuthState, s => s.user);
export const selectAccessToken     = createSelector(selectAuthState, s => s.accessToken);
export const selectAuthStatus      = createSelector(selectAuthState, s => s.status);
export const selectAuthError       = createSelector(selectAuthState, s => s.error);
export const selectTokenExpiresAt  = createSelector(selectAuthState, s => s.tokenExpiresAt);
export const selectPkceVerifier    = createSelector(selectAuthState, s => s.pkceVerifier);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  s => s.status === 'authenticated' && s.accessToken !== null,
);

export const selectIsRefreshing = createSelector(
  selectAuthState,
  s => s.status === 'refreshing',
);

export const selectIsTokenExpiringSoon = createSelector(
  selectTokenExpiresAt,
  (expiresAt) => {
    if (!expiresAt) return false;
    return (expiresAt - Date.now()) < 90_000; // within 90s
  },
);

export const selectUserDisplayName = createSelector(
  selectUser,
  user => user?.name ?? user?.email ?? 'Unknown',
);

export const selectUserInitials = createSelector(
  selectUser,
  user => {
    if (!user) return '?';
    return user.name
      .split(' ')
      .slice(0, 2)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  },
);
