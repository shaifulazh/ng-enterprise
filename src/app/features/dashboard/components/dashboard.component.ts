import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { DashboardActions } from '../store/dashboard.actions';
import { selectStats, selectActivity, selectDashboardLoading } from '../store/dashboard.reducer';
import { selectUserDisplayName } from '../../../core/store/auth/auth.selectors';
import { I18nService } from '../../../core/i18n/i18n.service';
import { StatCard, ActivityItem } from '../store/dashboard.state';
import { MiniChartComponent } from './mini-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MiniChartComponent],
  template: `
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">

      <!-- Page header -->
      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
          {{ t().dashboard.welcome }}{{ userName() ? ', ' + userName() : '' }} 👋
        </h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {{ t().dashboard.subtitle }}
        </p>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        @if (loading()) {
          @for (_ of [1,2,3,4]; track $index) {
            <div class="stat-card animate-pulse">
              <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
              <div class="h-7 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
              <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
            </div>
          }
        } @else {
          @for (stat of stats(); track stat.id) {
            <div class="stat-card hover:shadow-md transition-shadow duration-200">
              <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {{ resolveStatLabel(stat.label) }}
              </p>
              <p class="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
                {{ stat.value }}
              </p>
              <div class="mt-2 flex items-center gap-1.5">
                <span
                  class="flex items-center gap-0.5 text-xs font-semibold"
                  [class.text-emerald-600]="stat.trend === 'up'"
                  [class.dark:text-emerald-400]="stat.trend === 'up'"
                  [class.text-red-500]="stat.trend === 'down'"
                  [class.dark:text-red-400]="stat.trend === 'down'"
                  [class.text-slate-400]="stat.trend === 'flat'"
                >
                  @if (stat.trend === 'up') {
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/>
                    </svg>
                  } @else if (stat.trend === 'down') {
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
                    </svg>
                  } @else {
                    <span class="w-3 h-0.5 bg-slate-400 inline-block rounded"></span>
                  }
                  {{ stat.change > 0 ? '+' : '' }}{{ stat.change }}%
                </span>
                <span class="text-xs text-slate-400">{{ t().common.vsLastMonth }}</span>
              </div>
            </div>
          }
        }
      </div>

      <!-- Chart + activity -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <!-- Revenue chart -->
        <div class="card p-6 xl:col-span-2">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-base font-semibold text-slate-900 dark:text-white">
                {{ t().dashboard.revenue }}
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ t().dashboard.revenueSubtitle }}
              </p>
            </div>
            <div class="flex gap-1 bg-surface-tertiary dark:bg-surface-dark-tertiary rounded-lg p-1">
              @for (period of chartPeriods; track period) {
                <button
                  class="px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150"
                  [class.bg-white]="activePeriod === period"
                  [class.dark:bg-surface-dark-secondary]="activePeriod === period"
                  [class.text-slate-900]="activePeriod === period"
                  [class.dark:text-white]="activePeriod === period"
                  [class.shadow-sm]="activePeriod === period"
                  [class.text-slate-500]="activePeriod !== period"
                  [class.dark:text-slate-400]="activePeriod !== period"
                  (click)="activePeriod = period"
                >
                  {{ period }}
                </button>
              }
            </div>
          </div>
          <app-mini-chart />
        </div>

        <!-- Activity feed -->
        <div class="card p-6 flex flex-col">
          <h2 class="text-base font-semibold text-slate-900 dark:text-white mb-4 shrink-0">
            {{ t().dashboard.recentActivity }}
          </h2>

          @if (loading()) {
            <div class="space-y-4">
              @for (_ of [1,2,3,4]; track $index) {
                <div class="flex gap-3 animate-pulse">
                  <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                  <div class="flex-1 space-y-1.5 py-0.5">
                    <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div class="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <ul class="space-y-3 flex-1 overflow-y-auto">
              @for (item of activity(); track item.id) {
                <li class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300 shrink-0">
                    {{ item.avatar }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                      <span class="font-semibold text-slate-900 dark:text-white">{{ item.user }}</span>
                      {{ ' ' + item.action + ' ' }}
                      <span class="font-medium text-brand-600 dark:text-brand-400">{{ item.target }}</span>
                    </p>
                    <p class="text-xs text-slate-400 mt-0.5">{{ item.timestamp }}</p>
                  </div>
                </li>
              }
            </ul>
          }

          <button class="btn-ghost w-full mt-4 text-xs justify-center shrink-0 border border-slate-200 dark:border-slate-700/60 rounded-lg">
            {{ t().dashboard.viewAll }}
          </button>
        </div>
      </div>

    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private readonly store = inject(Store);
  readonly i18n          = inject(I18nService);

  readonly stats    = toSignal(this.store.select(selectStats),              { initialValue: [] as StatCard[] });
  readonly activity = toSignal(this.store.select(selectActivity),           { initialValue: [] as ActivityItem[] });
  readonly loading  = toSignal(this.store.select(selectDashboardLoading),   { initialValue: true });
  readonly userName = toSignal(this.store.select(selectUserDisplayName),    { initialValue: '' });
  readonly t        = this.i18n.t;

  readonly chartPeriods = ['6M', '1Y', 'All'];
  activePeriod          = '1Y';

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.loadStats());
    this.store.dispatch(DashboardActions.loadActivity());
  }

  /** Map API English label → translated string using the i18n dashboard section */
  resolveStatLabel(apiLabel: string): string {
    const labelMap: Record<string, 'totalRevenue' | 'activeUsers' | 'openTickets' | 'conversionRate'> = {
      'Total Revenue':   'totalRevenue',
      'Active Users':    'activeUsers',
      'Open Tickets':    'openTickets',
      'Conversion Rate': 'conversionRate',
    };
    const key = labelMap[apiLabel];
    return key ? this.t().dashboard[key] : apiLabel;
  }
}
