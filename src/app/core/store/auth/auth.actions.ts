import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from './auth.state';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // PKCE flow initiation
    'Login Start': emptyProps(),
    'Set Pkce Verifier': props<{ verifier: string }>(),

    // Authorization code → token exchange
    'Exchange Code For Token': props<{ code: string; callbackState: string }>(),
    'Exchange Code For Token Success': props<{
      accessToken: string;
      expiresIn:   number; // seconds
      user:        User;
    }>(),
    'Exchange Code For Token Failure': props<{ error: string }>(),

    // Silent refresh
    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{
      accessToken: string;
      expiresIn:   number;
    }>(),
    'Refresh Token Failure': props<{ error: string }>(),

    // User profile
    'Load User Success': props<{ user: User }>(),

    // Logout
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),

    // Restore session check (on page load)
    'Check Session': emptyProps(),
    'Session Expired': emptyProps(),
  },
});
