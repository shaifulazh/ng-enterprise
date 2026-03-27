import { Injectable, signal, computed } from '@angular/core';

/**
 * LoadingService — single source of truth for the global loading overlay.
 *
 * Works as a counter: every HTTP request increments on start, decrements
 * on complete (success or error). Overlay shows when count > 0.
 *
 * The loading interceptor calls show()/hide(); components can also call
 * them directly for non-HTTP async work.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _count = signal(0);

  /** True whenever any HTTP request (or manual show) is in flight */
  readonly isLoading = computed(() => this._count() > 0);

  show(): void {
    this._count.update(n => n + 1);
  }

  hide(): void {
    this._count.update(n => Math.max(0, n - 1));
  }

  /** Force-reset (use sparingly — only on unrecoverable error) */
  reset(): void {
    this._count.set(0);
  }
}
