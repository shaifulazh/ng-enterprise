import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * loadingInterceptor — automatically shows/hides the global loading overlay
 * for every outgoing HTTP request.
 *
 * Certain non-blocking calls (e.g. silent token refresh) can opt out by
 * adding the custom header  X-Skip-Loading: true  to the request.
 */
export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const loading = inject(LoadingService);

  // Allow callers to opt out of the overlay
  if (req.headers.has('X-Skip-Loading')) {
    const cleaned = req.clone({ headers: req.headers.delete('X-Skip-Loading') });
    return next(cleaned);
  }

  // Skip overlay for silent token refresh (keep UX smooth)
  if (req.url.includes('/oauth2/token') && req.body?.toString().includes('refresh_token')) {
    return next(req);
  }

  loading.show();

  return next(req).pipe(
    finalize(() => loading.hide()),
  );
};
