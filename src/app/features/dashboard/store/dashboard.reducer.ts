import { createReducer, on } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardState, initialDashboardState } from './dashboard.state';

export const dashboardReducer = createReducer<DashboardState>(
  initialDashboardState,

  on(DashboardActions.loadStats, state => ({ ...state, loading: true, error: null })),
  on(DashboardActions.loadStatsSuccess, (state, { stats }) => ({
    ...state, stats, loading: false,
  })),
  on(DashboardActions.loadStatsFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),

  on(DashboardActions.loadActivity, state => ({ ...state, loading: true })),
  on(DashboardActions.loadActivitySuccess, (state, { activity }) => ({
    ...state, activity, loading: false,
  })),
  on(DashboardActions.loadActivityFailure, (state, { error }) => ({
    ...state, loading: false, error,
  })),
);

const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

export const selectStats    = createSelector(selectDashboardState, s => s.stats);
export const selectActivity = createSelector(selectDashboardState, s => s.activity);
export const selectDashboardLoading = createSelector(selectDashboardState, s => s.loading);
