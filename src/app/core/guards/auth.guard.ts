import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { selectIsAuthenticated, selectAuthStatus } from '../store/auth/auth.selectors';
import { AuthActions } from '../store/auth/auth.actions';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const store  = inject(Store);
  const router = inject(Router);

  return store.select(selectAuthStatus).pipe(
    take(1),
    switchMap(status => {
      // If already authenticated, allow
      if (status === 'authenticated') return of(true);

      // If idle (e.g. page refresh), attempt silent refresh
      if (status === 'idle') {
        store.dispatch(AuthActions.checkSession());

        // Wait for auth state to resolve
        return store.select(selectIsAuthenticated).pipe(
          // Skip initial null/false state while refresh is in-flight
          switchMap(isAuth => {
            if (isAuth) return of(true);

            // After refresh attempt resolves and still not authenticated
            return store.select(selectAuthStatus).pipe(
              take(1),
              switchMap(resolvedStatus => {
                if (resolvedStatus === 'authenticated') return of(true);
                router.navigate(['/auth/login']);
                return of(false);
              }),
            );
          }),
          take(1),
        );
      }

      // Any other state — redirect to login
      router.navigate(['/auth/login']);
      return of(false);
    }),
  );
};

/** Role-based guard factory */
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (): Observable<boolean> => {
    const store  = inject(Store);
    const router = inject(Router);

    return store.select(state => (state as any).auth?.user?.roles ?? []).pipe(
      take(1),
      switchMap((roles: string[]) => {
        if (roles.includes(requiredRole)) return of(true);
        router.navigate(['/dashboard']);
        return of(false);
      }),
    );
  };
};
