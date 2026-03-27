import { Injectable, inject, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, timer } from 'rxjs';
import { switchMap, filter, take } from 'rxjs/operators';
import { AuthActions } from '../store/auth/auth.actions';
import { selectTokenExpiresAt, selectIsAuthenticated } from '../store/auth/auth.selectors';
import { environment } from '@env/environment';

/**
 * TokenService — single source of truth for the in-memory access token.
 *
 * The token is NEVER written to localStorage, sessionStorage, or cookies.
 * It lives only in this service's private field and in the NgRx store.
 * On page refresh the token is lost and must be recovered via silent refresh.
 */
@Injectable({ providedIn: 'root' })
export class TokenService implements OnDestroy {
  private readonly store      = inject(Store);
  private _accessToken: string | null = null;
  private refreshTimerSub: Subscription | null = null;

  /** Called by AuthEffects after a successful token exchange or refresh */
  setToken(token: string, expiresAt: number): void {
    this._accessToken = token;
    this.scheduleRefresh(expiresAt);
  }

  getToken(): string | null {
    return this._accessToken;
  }

  clearToken(): void {
    this._accessToken = null;
    this.cancelRefreshTimer();
  }

  private scheduleRefresh(expiresAt: number): void {
    this.cancelRefreshTimer();

    const msUntilRefresh = expiresAt - Date.now() - environment.tokenRefreshBufferMs;

    if (msUntilRefresh <= 0) {
      // Already expiring — refresh immediately
      this.store.dispatch(AuthActions.refreshToken());
      return;
    }

    this.refreshTimerSub = timer(msUntilRefresh)
      .pipe(
        switchMap(() =>
          this.store.select(selectIsAuthenticated).pipe(
            take(1),
            filter(Boolean),
          ),
        ),
      )
      .subscribe(() => {
        this.store.dispatch(AuthActions.refreshToken());
      });
  }

  private cancelRefreshTimer(): void {
    this.refreshTimerSub?.unsubscribe();
    this.refreshTimerSub = null;
  }

  ngOnDestroy(): void {
    this.cancelRefreshTimer();
  }
}
