import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take, finalize } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthActions } from '../store/auth/auth.actions';
import { selectIsRefreshing, selectAccessToken } from '../store/auth/auth.selectors';
import { environment } from '@env/environment';

let isRefreshing = false;
const refreshSubject$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const tokenService = inject(TokenService);
  const store        = inject(Store);

  // Skip auth header for OAuth endpoints themselves
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  const token = tokenService.getToken();
  const authReq = token ? addBearerToken(req, token) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return handle401(req, next, store, tokenService);
      }
      return throwError(() => error);
    }),
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: Store,
  tokenService: TokenService,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshSubject$.next(null);

    store.dispatch(AuthActions.refreshToken());

    return store.select(selectAccessToken).pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        refreshSubject$.next(token);
        isRefreshing = false;
        return next(addBearerToken(req, token!));
      }),
      catchError(err => {
        isRefreshing = false;
        store.dispatch(AuthActions.logout());
        return throwError(() => err);
      }),
      finalize(() => { isRefreshing = false; }),
    );
  }

  // Queue requests while refresh is in progress
  return refreshSubject$.pipe(
    filter(token => token !== null),
    take(1),
    switchMap(token => next(addBearerToken(req, token!))),
  );
}

function addBearerToken(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });
}

function isAuthEndpoint(url: string): boolean {
  return (
    url.includes('/oauth2/token') ||
    url.includes('/oauth2/authorize') ||
    url.includes('/oauth2/revoke') ||
    url.includes('/userinfo')
  );
}
