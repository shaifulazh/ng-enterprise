import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthActions } from '../../core/store/auth/auth.actions';
import { selectAuthStatus, selectAuthError } from '../../core/store/auth/auth.selectors';
import { interval } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="min-h-screen flex bg-surface-tertiary dark:bg-surface-dark">

      <!-- Left branding panel (desktop) -->
      <div class="hidden lg:flex lg:w-1/2 bg-brand-950 flex-col justify-between p-12">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span class="text-white font-semibold text-lg">Enterprise</span>
        </div>

        <div class="space-y-4">
          <h1 class="text-4xl font-bold text-white leading-tight text-balance">
            Built for teams<br/>that move fast.
          </h1>
          <p class="text-brand-300 text-lg">
            Secure, scalable, and ready for production.
          </p>
        </div>

        <p class="text-brand-400 text-sm">© 2025 Enterprise. All rights reserved.</p>
      </div>

      <!-- Right login panel -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="w-full max-w-sm space-y-8">

          <!-- Mobile logo -->
          <div class="flex items-center gap-3 lg:hidden">
            <div class="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="font-semibold text-lg text-slate-900 dark:text-white">Enterprise dd{{ isLoading() }}</span>
          </div>

          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Sign in</h2>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Use your organisation account to continue.
            </p>
          </div>

          @if (error()) {
            <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {{ error() }}
            </div>
          }

          <button
            class="btn-primary w-full py-2.5 text-base"
            
            (click)="login()"
          >
            @if (isLoading()== 'idle') {
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Redirecting…
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              Sign in with SSO
            }
          </button>

          <p class="text-xs text-center text-slate-400 dark:text-slate-500">
            By signing in you agree to our
            <a href="#" class="underline hover:text-slate-600 dark:hover:text-slate-300">Terms</a>
            and
            <a href="#" class="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly store = inject(Store);

  readonly isLoading = toSignal(
    this.store.select(selectAuthStatus).pipe(),
    { initialValue: 'idle' },
  );
  readonly error = toSignal(this.store.select(selectAuthError), { initialValue: null });

  login(): void {
    this.store.dispatch(AuthActions.loginStart());
  }

  counterObservable = interval(1000);
  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
