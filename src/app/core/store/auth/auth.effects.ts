import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { defer, EMPTY, of, Subject } from 'rxjs';
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  tap,
  withLatestFrom,
  filter,
} from 'rxjs/operators';

import { AuthActions } from './auth.actions';
import { OAuthService } from '../../services/oauth.service';
import { TokenService } from '../../services/token.service';
import { selectPkceVerifier, selectAccessToken } from './auth.selectors';
import { User } from './auth.state';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly store    = inject(Store);
  private readonly oauth    = inject(OAuthService);
  private readonly tokens   = inject(TokenService);
  private readonly router   = inject(Router);

  /** Initiate PKCE login flow */
  loginStart$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginStart),
        exhaustMap(async () => {
          const verifier = await this.oauth.initiateAuthorizationCodeFlow();
          // Store verifier in NgRx (memory only) before browser redirects
          // this.store.dispatch(AuthActions.setPkceVerifier({ verifier }));
        }),
      ),
    { dispatch: false },
  );

  // exchangeCode$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(AuthActions.exchangeCodeForToken),
  //       withLatestFrom(this.store.select(selectPkceVerifier)),
  //       switchMap(([{ code, callbackState }, verifier]) => {
  //         console.log("checking exchange code for token")
  //         return null;
  //       }),
  //     ),
  //   { dispatch: false },
  // );

  /** Exchange authorization code for access token */
  exchangeCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.exchangeCodeForToken),
      switchMap(({code, callbackState}) =>
        defer(() => {
          const verifier = sessionStorage.getItem('code_verifier');
          return verifier ? of({ code,callbackState, verifier }) : EMPTY;
        })
      ),
      switchMap(({code,callbackState,verifier}) => {
        if (!this.oauth.verifyState(callbackState)) {
          return of(AuthActions.exchangeCodeForTokenFailure({
            error: 'State mismatch — possible CSRF attack',
          }));
        }

        return this.oauth.exchangeCodeForToken(code, verifier!).pipe(
          switchMap(tokenResponse =>
            this.oauth.getUserInfo(tokenResponse.access_token).pipe(
              map(userInfo => {
                const user: User = {
                  sub:     userInfo['sub'] as string,
                  email:   userInfo['email'] as string,
                  name:    userInfo['name'] as string,
                  picture: userInfo['picture'] as string | undefined,
                  roles:   (userInfo['roles'] as string[]) ?? [],
                };

                return AuthActions.exchangeCodeForTokenSuccess({
                  accessToken: tokenResponse.access_token,
                  expiresIn:   tokenResponse.expires_in,
                  user,
                });
              }),
            ),
          ),
          catchError(err =>
            of(AuthActions.exchangeCodeForTokenFailure({
              error: err.message + 'Token exchange failed',
            })),
          ),
        );
      }),
    ),
  );


  /** Persist token in service after successful exchange */
  storeTokenAfterExchange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.exchangeCodeForTokenSuccess),
        tap(({ accessToken, expiresIn }) => {
          this.tokens.setToken(accessToken, Date.now() + expiresIn * 1000);
          this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  /** Silent token refresh (uses HttpOnly cookie) */
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() =>
        this.oauth.refreshAccessToken().pipe(
          map(tokenResponse =>
            AuthActions.refreshTokenSuccess({
              accessToken: tokenResponse.access_token,
              expiresIn:   tokenResponse.expires_in,
            }),
          ),
          catchError(err =>
            of(AuthActions.refreshTokenFailure({
              error: err.message ?? 'Refresh failed',
            })),
          ),
        ),
      ),
    ),
  );

  /** Update TokenService after silent refresh */
  storeTokenAfterRefresh$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenSuccess),
        tap(({ accessToken, expiresIn }) => {
          this.tokens.setToken(accessToken, Date.now() + expiresIn * 1000);
        }),
      ),
    { dispatch: false },
  );

  /** On refresh failure, redirect to login */
  onRefreshFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.refreshTokenFailure),
        tap(() => {
          this.tokens.clearToken();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );

  /** Logout — revoke token + clear state */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      withLatestFrom(this.store.select(selectAccessToken)),
      switchMap(([, token]) => {
        if (token) {
          return this.oauth.revokeToken(token).pipe(
            map(() => AuthActions.logoutSuccess()),
            catchError(() => of(AuthActions.logoutSuccess())), // always clear state
          );
        }
        return of(AuthActions.logoutSuccess());
      }),
    ),
  );

  /** After logout, clear token service and redirect */
  onLogoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.tokens.clearToken();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );

  /** On page load — attempt silent refresh to rehydrate session */
  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkSession),
      map(() => AuthActions.refreshToken()),
    ),
  );
}
