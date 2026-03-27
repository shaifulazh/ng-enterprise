import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Injectable, inject, Component, OnInit } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { I18nService } from '../../core/i18n/i18n.service';

// ── Model ─────────────────────────────────────────────────────────────────────
export interface ItemA {
  id:          string;
  name:        string;
  description: string;
  status:      'active' | 'inactive' | 'pending';
  createdAt:   string;
}

// ── Entity adapter ────────────────────────────────────────────────────────────
export interface ModuleAState extends EntityState<ItemA> {
  loading:    boolean;
  error:      string | null;
  selectedId: string | null;
}

export const adapterA: EntityAdapter<ItemA> = createEntityAdapter<ItemA>();

export const initialModuleAState: ModuleAState = adapterA.getInitialState({
  loading:    false,
  error:      null,
  selectedId: null,
});

// ── Actions ───────────────────────────────────────────────────────────────────
export const ModuleAActions = createActionGroup({
  source: 'Module A',
  events: {
    'Load Items':         emptyProps(),
    'Load Items Success': props<{ items: ItemA[] }>(),
    'Load Items Failure': props<{ error: string }>(),
    'Select Item':        props<{ id: string }>(),
    'Clear Selection':    emptyProps(),
  },
});

// ── Reducer ───────────────────────────────────────────────────────────────────
export const moduleAReducer = createReducer<ModuleAState>(
  initialModuleAState,
  on(ModuleAActions.loadItems,        state => ({ ...state, loading: true, error: null })),
  on(ModuleAActions.loadItemsSuccess, (state, { items }) => adapterA.setAll(items, { ...state, loading: false })),
  on(ModuleAActions.loadItemsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(ModuleAActions.selectItem,       (state, { id }) => ({ ...state, selectedId: id })),
  on(ModuleAActions.clearSelection,   state => ({ ...state, selectedId: null })),
);

// ── Selectors ─────────────────────────────────────────────────────────────────
const selectModuleAState = createFeatureSelector<ModuleAState>('moduleA');
const { selectAll, selectEntities } = adapterA.getSelectors();

export const selectAllItemsA      = createSelector(selectModuleAState, selectAll);
export const selectModuleALoading = createSelector(selectModuleAState, s => s.loading);
export const selectModuleAError   = createSelector(selectModuleAState, s => s.error);
export const selectSelectedIdA    = createSelector(selectModuleAState, s => s.selectedId);
export const selectSelectedItemA  = createSelector(
  selectModuleAState, selectEntities, selectSelectedIdA,
  (_, entities, id) => (id ? entities[id] ?? null : null),
);

// ── Effects ───────────────────────────────────────────────────────────────────
@Injectable()
export class ModuleAEffects {
  private readonly actions$ = inject(Actions);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModuleAActions.loadItems),
      switchMap(() =>
        of(MOCK_ITEMS_A).pipe(
          map(items => ModuleAActions.loadItemsSuccess({ items })),
          catchError(err => of(ModuleAActions.loadItemsFailure({ error: err.message }))),
        ),
      ),
    ),
  );
}

const MOCK_ITEMS_A: ItemA[] = [
  { id: '1', name: 'Item Alpha',  description: 'First item in Module A',  status: 'active',   createdAt: '2025-01-15' },
  { id: '2', name: 'Item Beta',   description: 'Second item in Module A', status: 'pending',  createdAt: '2025-02-20' },
  { id: '3', name: 'Item Gamma',  description: 'Third item in Module A',  status: 'active',   createdAt: '2025-03-05' },
  { id: '4', name: 'Item Delta',  description: 'Fourth item in Module A', status: 'inactive', createdAt: '2025-03-18' },
  { id: '5', name: 'Item Epsilon',description: 'Fifth item in Module A',  status: 'active',   createdAt: '2025-04-01' },
];

// ── Component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-module-a',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ t().moduleA.title }}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t().moduleA.subtitle }}</p>
        </div>
        <button class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          {{ t().moduleA.addItem }}
        </button>
      </div>

      @if (error()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {{ t().common.error }}: {{ error() }}
        </div>
      }

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-tertiary dark:bg-surface-dark-tertiary border-b border-slate-200 dark:border-slate-700/60">
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ t().moduleA.colName }}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ t().moduleA.colDesc }}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ t().moduleA.colStatus }}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ t().moduleA.colCreated }}</th>
                <th class="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{ t().common.actions }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/40">
              @if (loading()) {
                @for (_ of [1,2,3,4,5]; track $index) {
                  <tr class="animate-pulse">
                    @for (__ of [1,2,3,4,5]; track $index) {
                      <td class="px-4 py-3.5">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      </td>
                    }
                  </tr>
                }
              } @else {
                @for (item of items(); track item.id) {
                  <tr class="hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary/50 transition-colors">
                    <td class="px-4 py-3.5 font-medium text-slate-900 dark:text-white">{{ item.name }}</td>
                    <td class="px-4 py-3.5 text-slate-500 dark:text-slate-400 max-w-xs truncate">{{ item.description }}</td>
                    <td class="px-4 py-3.5">
                      <span
                        class="badge"
                        [class.badge-green]="item.status === 'active'"
                        [class.badge-blue]="item.status === 'pending'"
                        [class.badge-red]="item.status === 'inactive'"
                      >
                        {{ getStatusLabel(item.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3.5 text-slate-500 dark:text-slate-400 tabular-nums">{{ item.createdAt }}</td>
                    <td class="px-4 py-3.5">
                      <button class="btn-ghost text-xs py-1 px-2.5" (click)="select(item.id)">
                        {{ t().common.view }}
                      </button>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class ModuleAComponent implements OnInit {
  private readonly store = inject(Store);
  readonly i18n          = inject(I18nService);

  readonly items   = toSignal(this.store.select(selectAllItemsA),      { initialValue: [] as ItemA[] });
  readonly loading = toSignal(this.store.select(selectModuleALoading), { initialValue: true });
  readonly error   = toSignal(this.store.select(selectModuleAError),   { initialValue: null as string | null });
  readonly t       = this.i18n.t;

  ngOnInit(): void { this.store.dispatch(ModuleAActions.loadItems()); }

  select(id: string): void { this.store.dispatch(ModuleAActions.selectItem({ id })); }

  getStatusLabel(status: ItemA['status']): string {
    const map: Record<ItemA['status'], 'statusActive' | 'statusPending' | 'statusInactive'> = {
      active:   'statusActive',
      pending:  'statusPending',
      inactive: 'statusInactive',
    };
    return this.t().moduleA[map[status]];
  }
}

// ── Routes ────────────────────────────────────────────────────────────────────
export const moduleARoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('moduleA', moduleAReducer),
      provideEffects(ModuleAEffects),
    ],
    component: ModuleAComponent,
    title: 'Module A',
  },
];
