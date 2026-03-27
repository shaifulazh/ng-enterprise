import { createReducer, on } from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import { SettingsState, initialSettingsState } from './settings.state';

export const settingsReducer = createReducer<SettingsState>(
  initialSettingsState,

  on(SettingsActions.setTheme, (state, { theme }) => ({ ...state, theme })),

  on(SettingsActions.setLanguage, (state, { language }) => ({ ...state, language })),

  on(SettingsActions.restoreSettings, (state, { theme, language }) => ({
    ...state,
    theme,
    language,
  })),
);

// ── Selectors ──────────────────────────────────────────────────────────────
const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectTheme    = createSelector(selectSettingsState, s => s.theme);
export const selectLanguage = createSelector(selectSettingsState, s => s.language);

export const selectIsDarkMode = createSelector(selectTheme, theme => {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  // 'system' — match OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});
