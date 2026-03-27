import { createReducer, on } from '@ngrx/store';
import { LayoutActions } from './layout.actions';
import { LayoutState, initialLayoutState } from './layout.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const layoutReducer = createReducer<LayoutState>(
  initialLayoutState,

  on(LayoutActions.toggleSidebar, state => ({
    ...state,
    sidebarCollapsed: !state.sidebarCollapsed,
  })),

  on(LayoutActions.collapseSidebar, state => ({
    ...state,
    sidebarCollapsed: true,
  })),

  on(LayoutActions.expandSidebar, state => ({
    ...state,
    sidebarCollapsed: false,
  })),

  on(LayoutActions.toggleMobileMenu, state => ({
    ...state,
    mobileMenuOpen: !state.mobileMenuOpen,
  })),

  on(LayoutActions.closeMobileMenu, state => ({
    ...state,
    mobileMenuOpen: false,
  })),
);

// ── Selectors ──────────────────────────────────────────────────────────────
const selectLayoutState = createFeatureSelector<LayoutState>('layout');

export const selectSidebarCollapsed = createSelector(selectLayoutState, s => s.sidebarCollapsed);
export const selectMobileMenuOpen   = createSelector(selectLayoutState, s => s.mobileMenuOpen);
