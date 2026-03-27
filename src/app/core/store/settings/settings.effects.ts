import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, map, withLatestFrom } from 'rxjs/operators';
import { SettingsActions } from './settings.actions';
import { selectTheme, selectLanguage, selectIsDarkMode } from './settings.reducer';
import { Theme, Language } from './settings.state';

const SETTINGS_KEY = 'app_settings';

@Injectable()
export class SettingsEffects {
  private readonly actions$ = inject(Actions);
  private readonly store    = inject(Store);

  /** On app boot, restore settings from localStorage */
  loadFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.loadFromStorage),
      map(() => {
        try {
          const raw   = localStorage.getItem(SETTINGS_KEY);
          const saved = raw ? JSON.parse(raw) : {};
          return SettingsActions.restoreSettings({
            theme:    (saved.theme    as Theme)    ?? 'system',
            language: (saved.language as Language) ?? 'en',
          });
        } catch {
          return SettingsActions.restoreSettings({ theme: 'system', language: 'en' });
        }
      }),
    ),
  );

  /** Persist to localStorage whenever theme or language changes */
  persistSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SettingsActions.setTheme,
          SettingsActions.setLanguage,
          SettingsActions.restoreSettings,
        ),
        withLatestFrom(
          this.store.select(selectTheme),
          this.store.select(selectLanguage),
        ),
        tap(([, theme, language]) => {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ theme, language }));
        }),
      ),
    { dispatch: false },
  );

  /** Apply / remove 'dark' class on <html> element */
  applyDarkMode$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          SettingsActions.setTheme,
          SettingsActions.restoreSettings,
        ),
        withLatestFrom(this.store.select(selectIsDarkMode)),
        tap(([, isDark]) => {
          document.documentElement.classList.toggle('dark', isDark);
        }),
      ),
    { dispatch: false },
  );
}
