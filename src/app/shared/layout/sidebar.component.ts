import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { LayoutActions } from '../../core/store/layout/layout.actions';
import { selectSidebarCollapsed, selectMobileMenuOpen } from '../../core/store/layout/layout.reducer';

interface NavItem {
  label: string;
  route: string;
  icon:  string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard',  icon: 'grid'     },
  { label: 'Module A',  route: '/module-a',   icon: 'layers'   },
  { label: 'Module B',  route: '/module-b',   icon: 'database' },
  { label: 'Module C',  route: '/module-c',   icon: 'settings' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <!-- Mobile overlay -->
    @if (mobileOpen()) {
      <div
        class="fixed inset-0 z-20 bg-black/50 lg:hidden animate-fade-in"
        (click)="closeMobile()"
        aria-hidden="true"
      ></div>
    }

    <!-- Sidebar panel -->
    <aside
      class="fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-surface-dark-secondary border-r border-slate-200 dark:border-slate-700/60 sidebar-transition
             lg:relative lg:z-auto lg:translate-x-0"
      [class.w-64]="!collapsed()"
      [class.w-16]="collapsed()"
      [class.translate-x-0]="mobileOpen()"
      [class.-translate-x-full]="!mobileOpen()"
      [attr.aria-expanded]="!collapsed()"
    >
      <!-- Logo -->
      <div class="flex items-center h-16 px-4 border-b border-slate-200 dark:border-slate-700/60 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <div class="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          @if (!collapsed()) {
            <span class="font-semibold text-slate-900 dark:text-white truncate animate-fade-in">
              Enterprise
            </span>
          }
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden px-2 py-4 space-y-0.5" role="navigation">
        @for (item of navItems; track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="active"
            class="nav-item group"
            [title]="collapsed() ? item.label : ''"
            (click)="closeMobile()"
          >
            <span class="shrink-0" [innerHTML]="getIcon(item.icon)"></span>
            @if (!collapsed()) {
              <span class="truncate animate-fade-in">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- Collapse toggle (desktop) -->
      <div class="hidden lg:flex px-2 py-3 border-t border-slate-200 dark:border-slate-700/60">
        <button
          class="btn-ghost w-full justify-center"
          (click)="toggleCollapse()"
          [title]="collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
          aria-label="Toggle sidebar"
        >
          <svg class="w-4 h-4 transition-transform duration-200"
               [class.rotate-180]="collapsed()"
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </svg>
          @if (!collapsed()) {
            <span class="text-xs">Collapse</span>
          }
        </button>
      </div>
    </aside>
  `,
})
export class SidebarComponent {
  private readonly store = inject(Store);

  readonly navItems  = NAV_ITEMS;
  readonly collapsed = toSignal(this.store.select(selectSidebarCollapsed), { initialValue: false });
  readonly mobileOpen = toSignal(this.store.select(selectMobileMenuOpen), { initialValue: false });

  toggleCollapse(): void {
    this.store.dispatch(LayoutActions.toggleSidebar());
  }

  closeMobile(): void {
    this.store.dispatch(LayoutActions.closeMobileMenu());
  }

  getIcon(name: string): string {
    const icons: Record<string, string> = {
      grid:     `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke-width="2"/></svg>`,
      layers:   `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
      database: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5"/></svg>`,
      settings: `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3" stroke-width="2"/></svg>`,
    };
    return icons[name] ?? '';
  }
}
