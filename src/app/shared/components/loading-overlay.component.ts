import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { I18nService } from '../../core/i18n/i18n.service';

/**
 * LoadingOverlayComponent — full-screen, z-50 overlay that blocks all
 * interaction while HTTP requests are in flight.
 *
 * Placed once in LayoutShellComponent (and optionally in AppComponent
 * for pre-auth loading). Uses CSS transitions so it fades gracefully.
 *
 * The overlay is aria-live="assertive" so screen readers announce it.
 */
@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  styles: [`
    .overlay {
      opacity: 0;
      pointer-events: none;
      transition: opacity 150ms ease;
    }
    .overlay.active {
      opacity: 1;
      pointer-events: all;
    }
    .spinner-ring {
      animation: spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .spinner-track {
      animation: spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      animation-delay: -0.45s;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .dot-pulse span {
      animation: pulse 1.2s ease-in-out infinite;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
    .dot-pulse span:nth-child(2) { animation-delay: 0.2s; }
    .dot-pulse span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes pulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40%            { transform: scale(1);   opacity: 1;   }
    }
  `],
  template: `
    <div
      class="overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      [class.active]="loading.isLoading()"
      role="status"
      aria-live="assertive"
      [attr.aria-busy]="loading.isLoading()"
      [attr.aria-label]="i18n.t().loading.message"
    >
      <!-- Blurred backdrop -->
      <div class="absolute inset-0 bg-white/70 dark:bg-surface-dark/80 backdrop-blur-sm"></div>

      <!-- Card -->
      <div class="relative flex flex-col items-center gap-5 bg-white dark:bg-surface-dark-secondary rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/60 px-10 py-8">

        <!-- Dual-ring spinner -->
        <div class="relative w-14 h-14">
          <!-- Outer track -->
          <svg class="absolute inset-0 w-14 h-14 text-slate-200 dark:text-slate-700" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="24" stroke="currentColor" stroke-width="4"/>
          </svg>
          <!-- Spinning arc -->
          <svg class="spinner-ring absolute inset-0 w-14 h-14 text-brand-600" viewBox="0 0 56 56" fill="none">
            <circle
              cx="28" cy="28" r="24"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
              stroke-dasharray="38 113"
            />
          </svg>
          <!-- Inner spinning arc (offset) -->
          <svg class="spinner-track absolute inset-0 w-14 h-14 text-brand-300" viewBox="0 0 56 56" fill="none">
            <circle
              cx="28" cy="28" r="16"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-dasharray="20 80"
            />
          </svg>
        </div>

        <!-- Brand logo mark -->
        <div class="absolute top-6 right-6 left-6 flex justify-center pointer-events-none">
          <div class="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center mt-4">
            <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        </div>

        <!-- Message + animated dots -->
        <div class="text-center space-y-2">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ i18n.t().loading.message }}
          </p>
          <div class="dot-pulse flex items-center justify-center gap-1">
            <span class="bg-brand-400"></span>
            <span class="bg-brand-500"></span>
            <span class="bg-brand-600"></span>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class LoadingOverlayComponent {
  readonly loading = inject(LoadingService);
  readonly i18n    = inject(I18nService);
}
