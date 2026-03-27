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

export interface ModuleBItem {
  id:       string;
  title:    string;
  category: string;
  value:    number;
  date:     string;
}

export interface ModuleBState {
  items:        ModuleBItem[];
  loading:      boolean;
  error:        string | null;
  filterCategory: string | null;
}

const initialState: ModuleBState = {
  items:          [],
  loading:        false,
  error:          null,
  filterCategory: null,
};

export const ModuleBActions = createActionGroup({
  source: 'Module B',
  events: {
    'Load':           emptyProps(),
    'Load Success':   props<{ items: ModuleBItem[] }>(),
    'Load Failure':   props<{ error: string }>(),
    'Set Filter':     props<{ category: string | null }>(),
  },
});

export const moduleBReducer = createReducer<ModuleBState>(
  initialState,
  on(ModuleBActions.load, state => ({ ...state, loading: true, error: null })),
  on(ModuleBActions.loadSuccess, (state, { items }) => ({ ...state, items, loading: false })),
  on(ModuleBActions.loadFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(ModuleBActions.setFilter, (state, { category }) => ({ ...state, filterCategory: category })),
);

const selectModuleBState = createFeatureSelector<ModuleBState>('moduleB');
export const selectBItems = createSelector(selectModuleBState, s => s.items);
export const selectBLoading = createSelector(selectModuleBState, s => s.loading);
export const selectBFilter = createSelector(selectModuleBState, s => s.filterCategory);
export const selectFilteredBItems = createSelector(
  selectBItems, selectBFilter,
  (items, filter) => filter ? items.filter(i => i.category === filter) : items,
);

const MOCK_B: ModuleBItem[] = [
  { id: '1', title: 'Database Migration', category: 'Infrastructure', value: 12500, date: '2025-03-01' },
  { id: '2', title: 'API Gateway Setup',  category: 'Infrastructure', value: 8200,  date: '2025-03-05' },
  { id: '3', title: 'UI Redesign',        category: 'Frontend',       value: 15000, date: '2025-03-10' },
  { id: '4', title: 'Auth Integration',   category: 'Security',       value: 9800,  date: '2025-03-15' },
  { id: '5', title: 'Performance Audit',  category: 'Infrastructure', value: 6400,  date: '2025-03-18' },
  { id: '6', title: 'Component Library',  category: 'Frontend',       value: 11200, date: '2025-03-22' },
];

@Injectable()
export class ModuleBEffects {
  private readonly actions$ = inject(Actions);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModuleBActions.load),
      switchMap(() => of(MOCK_B).pipe()),
      map(items => ModuleBActions.loadSuccess({ items })),
      catchError(err => of(ModuleBActions.loadFailure({ error: err.message }))),
    ),
  );
}

@Component({
  selector: 'app-module-b',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto space-y-6 animate-fade-in">

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Module B</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage Module B data.</p>
        </div>
      </div>

      <!-- Category filter pills -->
      <div class="flex gap-2 flex-wrap">
        @for (cat of categories; track cat) {
          <button
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-colors border"
            [class.bg-brand-600]="activeFilter() === (cat === 'All' ? null : cat)"
            [class.text-white]="activeFilter() === (cat === 'All' ? null : cat)"
            [class.border-brand-600]="activeFilter() === (cat === 'All' ? null : cat)"
            [class.border-slate-200]="activeFilter() !== (cat === 'All' ? null : cat)"
            [class.text-slate-600]="activeFilter() !== (cat === 'All' ? null : cat)"
            [class.dark:border-slate-600]="activeFilter() !== (cat === 'All' ? null : cat)"
            [class.dark:text-slate-400]="activeFilter() !== (cat === 'All' ? null : cat)"
            (click)="setFilter(cat === 'All' ? null : cat)"
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Cards grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @if (loading()) {
          @for (_ of [1,2,3]; track $index) {
            <div class="card p-5 space-y-3 animate-pulse">
              <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              <div class="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-4"></div>
            </div>
          }
        } @else {
          @for (item of filteredItems(); track item.id) {
            <div class="card p-5 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between">
                <div class="min-w-0">
                  <p class="font-medium text-slate-900 dark:text-white truncate">{{ item.title }}</p>
                  <span class="badge badge-blue mt-1">{{ item.category }}</span>
                </div>
              </div>
              <div class="mt-4 flex items-end justify-between">
                <div>
                  <p class="text-xs text-slate-400">Value</p>
                  <p class="text-xl font-bold text-slate-900 dark:text-white">
                    RM {{ item.value.toLocaleString() }}
                  </p>
                </div>
                <p class="text-xs text-slate-400">{{ item.date }}</p>
              </div>
            </div>
          }
        }
      </div>

    </div>
  `,
})
export class ModuleBComponent implements OnInit {
  private readonly store = inject(Store);

  readonly filteredItems = toSignal(this.store.select(selectFilteredBItems), { initialValue: [] as ModuleBItem[] });
  readonly loading       = toSignal(this.store.select(selectBLoading), { initialValue: true });
  readonly activeFilter  = toSignal(this.store.select(selectBFilter), { initialValue: null as string | null });

  readonly categories = ['All', 'Infrastructure', 'Frontend', 'Security'];

  ngOnInit(): void {
    this.store.dispatch(ModuleBActions.load());
  }

  setFilter(cat: string | null): void {
    this.store.dispatch(ModuleBActions.setFilter({ category: cat }));
  }
}

export const moduleBRoutes: Routes = [
  {
    path: '',
    providers: [
      provideState('moduleB', moduleBReducer),
      provideEffects(ModuleBEffects),
    ],
    component: ModuleBComponent,
    title: 'Module B',
  },
];
