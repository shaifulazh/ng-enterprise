import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutActions } from '../../core/store/layout/layout.actions';
import { SettingsActions } from '../../core/store/settings/settings.actions';
import { selectSidebarCollapsed, selectMobileMenuOpen } from '../../core/store/layout/layout.reducer';
import { I18nService } from '../../core/i18n/i18n.service';

interface NavItem {
  labelKey: 'dashboard' | 'moduleA' | 'moduleB' | 'moduleC' | 'profile';
  route:    string;
  icon:     string;
}

const NAV_ITEMS: NavItem[] = [
  { labelKey: 'dashboard', route: '/dashboard', icon: 'grid'     },
  { labelKey: 'moduleA',   route: '/module-a',  icon: 'layers'   },
  { labelKey: 'moduleB',   route: '/module-b',  icon: 'database' },
  { labelKey: 'moduleC',   route: '/module-c',  icon: 'settings' },
  { labelKey: 'profile', route: '/profile', icon: 'test'}
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  styles: [`
    :host { display: contents; }

    .tooltip {
      opacity: 0;
      pointer-events: none;
      transition: opacity 120ms ease;
    }
    .nav-item:hover .tooltip {
      opacity: 1;
    }
  `],
  template: `
    <!-- Mobile overlay backdrop -->
    @if (mobileOpen()) {
      <div
        class="fixed inset-0 z-20 bg-black/50 lg:hidden animate-fade-in"
        (click)="closeMobile()"
        aria-hidden="true"
      ></div>
    }

    <!--
      SIDEBAR PANEL
      ─────────────────────────────────────────────────────────────────────────
      Desktop  : relative in the flex-row, h-screen so it exactly fills the
                 viewport. No position:fixed needed — parent layout is
                 overflow-hidden so page body never scrolls.
      Mobile   : fixed left slide-over, z-30, controlled by mobileOpen signal.
      ─────────────────────────────────────────────────────────────────────────
    -->
    <aside
      class="
        flex flex-col shrink-0
        bg-white dark:bg-surface-dark-secondary
        border-r border-slate-200 dark:border-slate-700/60
        sidebar-transition overflow-hidden

        fixed inset-y-0 left-0 z-30
        lg:relative lg:inset-auto lg:z-auto lg:h-screen lg:translate-x-0
      "
      [class.w-64]="!collapsed()"
      [class.w-16]="collapsed()"
      [class.translate-x-0]="mobileOpen()"
      [class.-translate-x-full]="!mobileOpen()"
      [attr.aria-expanded]="!collapsed()"
      role="navigation"
    >

      <!-- ── Logo ──────────────────────────────────────────────────────────── -->
      <div class="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700/60 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0 shadow-sm">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          @if (!collapsed()) {
            <div class="min-w-0 animate-fade-in">
              <p class="font-semibold text-slate-900 dark:text-white truncate text-sm leading-none">Enterprise</p>
              <p class="text-xs text-slate-400 truncate mt-0.5">v1.0</p>
            </div>
          }
        </div>
      </div>

      <!-- ── Navigation ─────────────────────────────────────────────────────── -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-0.5">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item group relative"
            (click)="closeMobile()"
            [attr.aria-label]="t().nav[item.labelKey]"
          >
            <span class="shrink-0" [innerHTML]="getIcon(item.icon)"></span>

            @if (!collapsed()) {
              <span class="truncate animate-fade-in text-sm">
                {{ t().nav[item.labelKey] }}
              </span>
            }

            <!-- Tooltip shown only when collapsed -->
            @if (collapsed()) {
              <span class="
                tooltip absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium
                bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900
                whitespace-nowrap z-50 shadow-lg
              ">
                {{ t().nav[item.labelKey] }}
                <!-- Arrow -->
                <span class="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-100"></span>
              </span>
            }
          </a>
        }
      </nav>

      <!-- ── Language switcher ──────────────────────────────────────────────── -->
      <div class="px-2 py-3 border-t border-slate-200 dark:border-slate-700/60 shrink-0">
        @if (!collapsed()) {
          <!-- Pill toggle: EN | BM -->
          <div class="flex items-center gap-1 bg-surface-tertiary dark:bg-surface-dark-tertiary rounded-lg p-1">
            @for (lang of i18n.supportedLanguages; track lang.code) {
              <button
                class="flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-150"
                [class.bg-white]="currentLang() === lang.code"
                [class.dark:bg-surface-dark-secondary]="currentLang() === lang.code"
                [class.text-brand-700]="currentLang() === lang.code"
                [class.dark:text-brand-400]="currentLang() === lang.code"
                [class.shadow-sm]="currentLang() === lang.code"
                [class.text-slate-400]="currentLang() !== lang.code"
                [class.dark:text-slate-500]="currentLang() !== lang.code"
                (click)="setLang(lang.code)"
              >
                {{ lang.code === 'en' ? 'EN' : 'BM' }}
              </button>
            }
          </div>
        } @else {
          <!-- Collapsed: small rotating badge -->
          <button
            class="w-full flex items-center justify-center h-9 rounded-lg text-xs font-bold
                   text-brand-600 dark:text-brand-400
                   hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
            (click)="cycleLanguage()"
            [title]="t().settings.language"
          >
            {{ i18n.langLabel() }}
          </button>
        }
      </div>

      <!-- ── Collapse toggle (desktop only) ────────────────────────────────── -->
      <div class="hidden lg:flex px-2 pb-3 shrink-0">
        <button
          class="btn-ghost w-full justify-center gap-2"
          (click)="toggleCollapse()"
          [title]="collapsed() ? t().nav.expand : t().nav.collapse"
        >
          <svg
            class="w-4 h-4 transition-transform duration-200 shrink-0"
            [class.rotate-180]="collapsed()"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
          @if (!collapsed()) {
            <span class="text-xs animate-fade-in">{{ t().nav.collapse }}</span>
          }
        </button>
      </div>

    </aside>
  `,
})
export class SidebarComponent {
  private readonly store = inject(Store);
  readonly i18n          = inject(I18nService);
  readonly navItems      = NAV_ITEMS;

  readonly collapsed   = toSignal(this.store.select(selectSidebarCollapsed), { initialValue: false });
  readonly mobileOpen  = toSignal(this.store.select(selectMobileMenuOpen),   { initialValue: false });
  readonly currentLang = this.i18n.lang;
  readonly t           = this.i18n.t;

  toggleCollapse(): void { this.store.dispatch(LayoutActions.toggleSidebar()); }
  closeMobile(): void    { this.store.dispatch(LayoutActions.closeMobileMenu()); }

  setLang(code: 'en' | 'ms'): void {
    this.store.dispatch(SettingsActions.setLanguage({ language: code }));
  }

  cycleLanguage(): void {
    this.setLang(this.i18n.lang() === 'en' ? 'ms' : 'en');
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      grid: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2"/>
      </svg>`,
      layers: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>`,
      database: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <ellipse cx="12" cy="5" rx="9" ry="3" stroke-width="2"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5"/>
      </svg>`,
      settings: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94
                 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724
                 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572
                 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826
                 -2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
                 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <circle cx="12" cy="12" r="3" stroke-width="2"/>
      </svg>`,
    };
    return icons[name] ?? '';
  }
}
