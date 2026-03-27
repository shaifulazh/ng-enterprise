import { Component, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutActions } from '../../core/store/layout/layout.actions';
import { SettingsActions } from '../../core/store/settings/settings.actions';
import { AuthActions } from '../../core/store/auth/auth.actions';
import { selectUserDisplayName, selectUserInitials } from '../../core/store/auth/auth.selectors';
import { selectIsDarkMode } from '../../core/store/settings/settings.reducer';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  template: `
    <header class="h-16 bg-white dark:bg-surface-dark-secondary border-b border-slate-200 dark:border-slate-700/60 flex items-center px-4 gap-3 shrink-0 z-10">

      <!-- Mobile hamburger -->
      <button
        class="btn-ghost lg:hidden p-2"
        (click)="toggleMobile()"
        aria-label="Open navigation"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Breadcrumb / title slot -->
      <div class="flex-1 min-w-0">
        <h1 class="text-sm font-medium text-slate-900 dark:text-white truncate sr-only lg:not-sr-only">
          {{ pageTitle() }}
        </h1>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-1">

        <!-- Dark mode toggle -->
        <button
          class="btn-ghost p-2"
          (click)="toggleDarkMode()"
          [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          @if (isDark()) {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
          } @else {
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          }
        </button>

        <!-- Notifications -->
        <button class="btn-ghost p-2 relative" aria-label="Notifications">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full"></span>
        </button>

        <!-- Profile dropdown -->
        <div class="relative ml-1">
          <button
            class="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
            (click)="profileOpen.set(!profileOpen())"
            [attr.aria-expanded]="profileOpen()"
            aria-haspopup="true"
          >
            <div class="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-semibold select-none">
              {{ initials() }}
            </div>
            <span class="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
              {{ displayName() }}
            </span>
            <svg class="w-4 h-4 text-slate-400 transition-transform duration-150"
                 [class.rotate-180]="profileOpen()"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          @if (profileOpen()) {
            <div
              class="absolute right-0 top-full mt-1.5 w-52 card py-1 z-50 animate-fade-in"
              role="menu"
            >
              <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p class="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ displayName() }}</p>
              </div>

              @for (item of profileMenuItems; track item.label) {
                <button
                  class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors"
                  role="menuitem"
                  (click)="handleProfileAction(item.action)"
                >
                  <span [innerHTML]="item.icon" class="text-slate-400"></span>
                  {{ item.label }}
                </button>
              }
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class TopNavbarComponent {
  private readonly store = inject(Store);

  readonly profileOpen  = signal(false);
  readonly isDark       = toSignal(this.store.select(selectIsDarkMode), { initialValue: false });
  readonly displayName  = toSignal(this.store.select(selectUserDisplayName), { initialValue: '' });
  readonly initials     = toSignal(this.store.select(selectUserInitials), { initialValue: '?' });
  readonly pageTitle    = signal('Dashboard');

  readonly profileMenuItems = [
    {
      label:  'Profile',
      action: 'profile',
      icon:   `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`,
    },
    {
      label:  'Settings',
      action: 'settings',
      icon:   `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" stroke-width="2"/></svg>`,
    },
    {
      label:  'Logout',
      action: 'logout',
      icon:   `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>`,
    },
  ];

  toggleMobile(): void {
    this.store.dispatch(LayoutActions.toggleMobileMenu());
  }

  toggleDarkMode(): void {
    const next = this.isDark() ? 'light' : 'dark';
    this.store.dispatch(SettingsActions.setTheme({ theme: next }));
  }

  handleProfileAction(action: string): void {
    this.profileOpen.set(false);
    if (action === 'logout') {
      this.store.dispatch(AuthActions.logout());
    }
  }
}
