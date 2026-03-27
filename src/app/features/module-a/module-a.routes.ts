// ─────────────────────────────────────────────────────────────────────────────
// Module A — complete lazy-loaded NgRx feature slice
// Copy this pattern for Module B and Module C; just change the feature name.
// ─────────────────────────────────────────────────────────────────────────────

// ── state ────────────────────────────────────────────────────────────────────
import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Injectable, inject, Component, OnInit } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

// ── model ─────────────────────────────────────────────────────────────────────
export interface ItemA {
  id:          string;
  name:        string;
  description: string;
  status:      'active' | 'inactive' | 'pending';
  createdAt:   string;
}

// ── entity adapter ────────────────────────────────────────────────────────────
export interface ModuleAState extends EntityState<ItemA> {
  loading: boolean;
  error:   string | null;
  selectedId: string | null;
}

export const adapterA: EntityAdapter<ItemA> = createEntityAdapter<ItemA>();

export const initialModuleAState: ModuleAState = adapterA.getInitialState({
  loading:    false,
  error:      null,
  selectedId: null,
});

// ── actions ───────────────────────────────────────────────────────────────────
export const ModuleAActions = createActionGroup({
  source: 'Module A',
  events: {
    'Load Items':           emptyProps(),
    'Load Items Success':   props<{ items: ItemA[] }>(),
    'Load Items Failure':   props<{ error: string }>(),
    'Select Item':          props<{ id: string }>(),
    'Clear Selection':      emptyProps(),
  },
});

// ── reducer ───────────────────────────────────────────────────────────────────
export const moduleAReducer = createReducer<ModuleAState>(
  initialModuleAState,

  on(ModuleAActions.loadItems, state => ({ ...state, loading: true, error: null })),

  on(ModuleAActions.loadItemsSuccess, (state, { items }) =>
    adapterA.setAll(items, { ...state, loading: false }),
  ),

  on(ModuleAActions.loadItemsFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),

  on(ModuleAActions.selectItem, (state, { id }) => ({
    ...state, selectedId: id,
  })),

  on(ModuleAActions.clearSelection, state => ({
    ...state, selectedId: null,
  })),
);

// ── selectors ─────────────────────────────────────────────────────────────────
const selectModuleAState = createFeatureSelector<ModuleAState>('moduleA');

const { selectAll, selectEntities, selectIds } = adapterA.getSelectors();

export const selectAllItemsA     = createSelector(selectModuleAState, selectAll);
export const selectModuleALoading = createSelector(selectModuleAState, s => s.loading);
export const selectModuleAError   = createSelector(selectModuleAState, s => s.error);
export const selectSelectedIdA    = createSelector(selectModuleAState, s => s.selectedId);
export const selectSelectedItemA  = createSelector(
  selectModuleAState,
  selectEntities,
  selectSelectedIdA,
  (_, entities, id) => (id ? entities[id] ?? null : null),
);

// ── effects ───────────────────────────────────────────────────────────────────
@Injectable()
export class ModuleAEffects {
  private readonly actions$ = inject(Actions);
  private readonly http     = inject(HttpClient);

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModuleAActions.loadItems),
      switchMap(() =>
        // Replace with: this.http.get<ItemA[]>('/api/module-a/items')
        of(MOCK_ITEMS_A).pipe(),
      ),
    ).pipe(
      map(items => ModuleAActions.loadItemsSuccess({ items })),
      catchError(err => of(ModuleAActions.loadItemsFailure({ error: err.message }))),
    ),
  );
}

const statuses: ItemA['status'][] = ['active', 'pending', 'inactive'];

const MOCK_ITEMS_A: ItemA[] = Array.from({ length: 200 }, (_, i) => {
  const index = i + 1; // start from 1
  const status = statuses[i % statuses.length]; // rotate statuses
  const month = String((i % 12) + 1).padStart(2, '0'); // months 01–12
  const day = String((i % 28) + 1).padStart(2, '0'); // days 01–28

  return {
    id: String(index),
    name: `Item ${index}`,
    description: `Item number ${index} in Module A`,
    status,
    createdAt: `2025-${month}-${day}`,
  };
});

// ── component ─────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-module-a',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Module A</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your Module A resources.
          </p>
        </div>
        <button class="btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add Item
        </button>
      </div>

      @if (error()) {
        <div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {{ error() }}
        </div>
      }

      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-surface-tertiary dark:bg-surface-dark-tertiary text-left">
                <th class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Name</th>
                <th class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Description</th>
                <th class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Status</th>
                <th class="px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wide">Created</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
              @if (loading()) {
                @for (_ of [1,2,3,4]; track $index) {
                  <tr class="animate-pulse">
                    @for (__ of [1,2,3,4,5]; track $index) {
                      <td class="px-4 py-3">
                        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      </td>
                    }
                  </tr>
                }
              } @else {
                @for (item of items(); track item.id) {
                  <tr class="hover:bg-surface-tertiary dark:hover:bg-surface-dark-tertiary transition-colors">
                    <td class="px-4 py-3 font-medium text-slate-900 dark:text-white">{{ item.name }}</td>
                    <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ item.description }}</td>
                    <td class="px-4 py-3">
                      <span
                        class="badge"
                        [class.badge-green]="item.status === 'active'"
                        [class.badge-blue]="item.status === 'pending'"
                        [class.badge-red]="item.status === 'inactive'"
                      >
                        {{ item.status }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-slate-500 dark:text-slate-400">{{ item.createdAt }}</td>
                    <td class="px-4 py-3">
                      <button class="btn-ghost text-xs py-1 px-2" (click)="select(item.id)">
                        View
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

  readonly items   = toSignal(this.store.select(selectAllItemsA), { initialValue: [] as ItemA[] });
  readonly loading = toSignal(this.store.select(selectModuleALoading), { initialValue: true });
  readonly error   = toSignal(this.store.select(selectModuleAError), { initialValue: null as string | null });

  ngOnInit(): void {
    this.store.dispatch(ModuleAActions.loadItems());
  }

  select(id: string): void {
    this.store.dispatch(ModuleAActions.selectItem({ id }));
  }
}

// ── routes ────────────────────────────────────────────────────────────────────
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
