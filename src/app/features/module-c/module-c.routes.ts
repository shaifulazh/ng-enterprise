import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { createReducer, on } from '@ngrx/store';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Injectable, inject, Component, OnInit } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/i18n/i18n.service';

// ── Model ─────────────────────────────────────────────────────────────────────
export interface ConfigEntry {
  key:         string;
  label:       string;
  value:       string;
  description: string;
  type:        'text' | 'toggle' | 'select';
  options?:    string[];
}

export interface ModuleCState {
  config:  ConfigEntry[];
  loading: boolean;
  saved:   boolean;
  error:   string | null;
}

const initialState: ModuleCState = { config: [], loading: false, saved: false, error: null };

// ── Actions ───────────────────────────────────────────────────────────────────
export const ModuleCActions = createActionGroup({
  source: 'Module C',
  events: {
    'Load Config':         emptyProps(),
    'Load Config Success': props<{ config: ConfigEntry[] }>(),
    'Load Config Failure': props<{ error: string }>(),
    'Save Config':         props<{ config: ConfigEntry[] }>(),
    'Save Config Success': emptyProps(),
    'Save Config Failure': props<{ error: string }>(),
  },
});

// ── Reducer ───────────────────────────────────────────────────────────────────
export const moduleCReducer = createReducer<ModuleCState>(
  initialState,
  on(ModuleCActions.loadConfig,        state => ({ ...state, loading: true })),
  on(ModuleCActions.loadConfigSuccess, (state, { config }) => ({ ...state, config, loading: false })),
  on(ModuleCActions.loadConfigFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(ModuleCActions.saveConfig,        state => ({ ...state, loading: true, saved: false })),
  on(ModuleCActions.saveConfigSuccess, state => ({ ...state, loading: false, saved: true })),
  on(ModuleCActions.saveConfigFailure, (state, { error }) => ({ ...state, loading: false, error })),
);

// ── Selectors ─────────────────────────────────────────────────────────────────
const selectModuleCState = createFeatureSelector<ModuleCState>('moduleC');
export const selectCConfig  = createSelector(selectModuleCState, s => s.config);
export const selectCLoading = createSelector(selectModuleCState, s => s.loading);
export const selectCSaved   = createSelector(selectModuleCState, s => s.saved);

// ── Mock data ─────────────────────────────────────────────────────────────────
const MOCK_CONFIG: ConfigEntry[] = [
  { key: 'app_name',     label: 'Application Name',    value: 'Enterprise App', description: 'Display name shown in the UI',             type: 'text' },
  { key: 'max_users',    label: 'Max Concurrent Users', value: '500',           description: 'Maximum simultaneous active sessions',      type: 'text' },
  { key: 'dark_default', label: 'Default Dark Mode',   value: 'false',         description: 'Enable dark mode by default for new users',  type: 'toggle' },
  { key: 'log_level',    label: 'Log Level',           value: 'info',          description: 'Application logging verbosity',             type: 'select', options: ['debug', 'info', 'warn', 'error'] },
  { key: 'session_ttl',  label: 'Session TTL (min)',   value: '60',            description: 'Idle session timeout in minutes',           type: 'text' },
  { key: 'maintenance',  label: 'Maintenance Mode',    value: 'false',         description: 'Show maintenance banner to all users',      type: 'toggle' },
];

// ── Effects ───────────────────────────────────────────────────────────────────
@Injectable()
export class ModuleCEffects {
  private readonly actions$ = inject(Actions);

  loadConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModuleCActions.loadConfig),
      switchMap(() =>
        of(MOCK_CONFIG).pipe(
          map(config => ModuleCActions.loadConfigSuccess({ config })),
          catchError(err => of(ModuleCActions.loadConfigFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  saveConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModuleCActions.saveConfig),
      switchMap(() =>
        of(void 0).pipe(
          map(() => ModuleCActions.saveConfigSuccess()),
          catchError(err => of(ModuleCActions.saveConfigFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-module-c',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6 animate-fade-in">

      <div>
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t().moduleC.title }}</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t().moduleC.subtitle }}</p>
      </div>

      <!-- Success banner -->
      @if (saved()) {
        <div class="flex items-center gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm text-emerald-700 dark:text-emerald-400">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          {{ t().moduleC.savedOk }}
        </div>
      }

      <!-- Config entries -->
      <div class="card divide-y divide-slate-100 dark:divide-slate-700/50">
        @if (loading()) {
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <div class="p-5 flex justify-between items-center animate-pulse gap-6">
              <div class="space-y-2 flex-1">
                <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40"></div>
                <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
              </div>
              <div class="h-9 bg-slate-200 dark:bg-slate-700 rounded w-32 shrink-0"></div>
            </div>
          }
        } @else {
          @for (entry of localConfig; track entry.key; let i = $index) {
            <div class="p-5 flex items-center justify-between gap-6">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ entry.label }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ entry.description }}</p>
              </div>

              @if (entry.type === 'toggle') {
                <button
                  class="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  [class.bg-brand-600]="entry.value === 'true'"
                  [class.bg-slate-200]="entry.value !== 'true'"
                  [class.dark:bg-slate-600]="entry.value !== 'true'"
                  (click)="toggleValue(i)"
                  role="switch"
                  [attr.aria-checked]="entry.value === 'true'"
                >
                  <span
                    class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
                    [class.translate-x-5]="entry.value === 'true'"
                  ></span>
                </button>

              } @else if (entry.type === 'select') {
                <select
                  class="input-field w-36 shrink-0"
                  [(ngModel)]="localConfig[i].value"
                >
                  @for (opt of entry.options; track opt) {
                    <option [value]="opt">{{ opt }}</option>
                  }
                </select>

              } @else {
                <input
                  type="text"
                  class="input-field w-44 shrink-0"
                  [(ngModel)]="localConfig[i].value"
                />
              }
            </div>
          }
        }
      </div>

      <!-- Save row -->
      <div class="flex items-center justify-between">
        <p class="text-xs text-slate-400">
          {{ t().common.description }}: {{ localConfig.length }} {{ t().common.actions }}
        </p>
        <button
          class="btn-primary min-w-[140px]"
          [disabled]="loading()"
          (click)="save()"
        >
          @if (loading()) {
            <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          }
          {{ t().moduleC.saveChanges }}
        </button>
      </div>

    </div>
  `,
})
export class ModuleCComponent implements OnInit {
  private readonly store = inject(Store);
  readonly i18n          = inject(I18nService);

  readonly configFromStore = toSignal(this.store.select(selectCConfig),  { initialValue: [] as ConfigEntry[] });
  readonly loading         = toSignal(this.store.select(selectCLoading), { initialValue: true });
  readonly saved           = toSignal(this.store.select(selectCSaved),   { initialValue: false });
  readonly t               = this.i18n.t;

  localConfig: ConfigEntry[] = [];

  ngOnInit(): void {
    this.store.dispatch(ModuleCActions.loadConfig());
    this.store.select(selectCConfig).subscribe(cfg => {
      this.localConfig = cfg.map(c => ({ ...c }));
    });
  }

  toggleValue(index: number): void {
    this.localConfig[index] = {
      ...this.localConfig[index],
      value: this.localConfig[index].value === 'true' ? 'false' : 'true',
    };
  }

  save(): void {
    this.store.dispatch(ModuleCActions.saveConfig({ config: this.localConfig }));
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
export const moduleCRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('moduleC', moduleCReducer),
      provideEffects(ModuleCEffects),
    ],
    component: ModuleCComponent,
    title: 'Module C',
  },
];
