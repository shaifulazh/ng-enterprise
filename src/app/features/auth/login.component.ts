import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthActions } from '../../core/store/auth/auth.actions';
import { selectAuthStatus, selectAuthError } from '../../core/store/auth/auth.selectors';
import { I18nService } from '../../core/i18n/i18n.service';
import { SettingsActions } from '../../core/store/settings/settings.actions';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="min-h-screen flex bg-surface-tertiary dark:bg-surface-dark">

      <!-- Left branding panel (desktop only) -->
      <div class="hidden lg:flex lg:w-1/2 bg-brand-950 flex-col justify-between p-12">

        <!-- Top: Logo + lang switcher -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span class="text-white font-semibold text-lg">Enterprise</span>
          </div>

          <!-- Language toggle on login page -->
          <div class="flex gap-1 bg-brand-900/50 rounded-lg p-1">
            @for (lang of i18n.supportedLanguages; track lang.code) {
              <button
                class="px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150"
                [class.bg-brand-600]="i18n.lang() === lang.code"
                [class.text-white]="i18n.lang() === lang.code"
                [class.text-brand-400]="i18n.lang() !== lang.code"
                [class.hover:text-white]="i18n.lang() !== lang.code"
                (click)="setLang(lang.code)"
              >
                {{ lang.code === 'en' ? 'EN' : 'BM' }}
              </button>
            }
          </div>
        </div>

        <!-- Middle: Tagline -->
        <div class="space-y-4">
          <h1 class="text-4xl font-bold text-white leading-tight text-balance">
            {{ t().auth.tagline }}
          </h1>
          <p class="text-brand-300 text-lg">{{ t().auth.taglineSubtitle }}</p>
        </div>

        <!-- Bottom: Copyright -->
        <p class="text-brand-500 text-sm">{{ t().auth.copyright }}</p>
      </div>

      <!-- Right login panel -->
      <div class="flex-1 flex items-center justify-center p-6">
        <div class="w-full max-w-sm space-y-8">

          <!-- Mobile header -->
          <div class="flex items-center justify-between lg:hidden">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span class="font-semibold text-lg text-slate-900 dark:text-white">Enterprise</span>
            </div>
            <!-- Mobile lang toggle -->
            <div class="flex gap-1 bg-surface-tertiary dark:bg-surface-dark-tertiary rounded-lg p-1">
              @for (lang of i18n.supportedLanguages; track lang.code) {
                <button
                  class="px-2.5 py-1 rounded-md text-xs font-semibold transition-all"
                  [class.bg-white]="i18n.lang() === lang.code"
                  [class.dark:bg-surface-dark-secondary]="i18n.lang() === lang.code"
                  [class.text-brand-700]="i18n.lang() === lang.code"
                  [class.text-slate-400]="i18n.lang() !== lang.code"
                  (click)="setLang(lang.code)"
                >
                  {{ lang.code === 'en' ? 'EN' : 'BM' }}
                </button>
              }
            </div>
          </div>

          <!-- Sign-in heading -->
          <div>
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t().auth.signIn }}</h2>
            <p class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
              {{ t().auth.orgAccount }}
            </p>
          </div>

          <!-- Error banner -->
          @if (error()) {
            <div class="flex items-start gap-3 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              <svg class="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ error() }}
            </div>
          }

          <!-- SSO Button -->
          <button
            class="btn-primary w-full py-3 text-sm"
            [disabled]="isLoading()"
            (click)="login()"
          >
            @if (isLoading()) {
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              {{ t().auth.signingIn }}
            } @else {
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              {{ t().auth.signInWith }}
            }
          </button>

          <!-- Terms -->
          <p class="text-xs text-center text-slate-400 dark:text-slate-500">
            {{ t().auth.termsPrefix }}
            <a href="#" class="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{{ t().auth.terms }}</a>
            {{ t().auth.and }}
            <a href="#" class="underline hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{{ t().auth.privacy }}</a>.
          </p>

        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private readonly store = inject(Store);
  readonly i18n          = inject(I18nService);

  readonly status    = toSignal(this.store.select(selectAuthStatus), { initialValue: 'idle' });
  readonly error     = toSignal(this.store.select(selectAuthError),  { initialValue: null as string | null });
  readonly t         = this.i18n.t;
  readonly isLoading = () => this.status() === 'loading';

  login(): void { this.store.dispatch(AuthActions.loginStart()); }

  setLang(code: 'en' | 'ms'): void {
    this.store.dispatch(SettingsActions.setLanguage({ language: code }));
  }
}
