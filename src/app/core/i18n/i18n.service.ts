import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectLanguage } from '../store/settings/settings.reducer';
import { TRANSLATIONS, Translations, Language } from './translations';

/**
 * I18nService — reactive, signal-based translation service.
 *
 * Usage in a component:
 *   private readonly i18n = inject(I18nService);
 *   readonly t = this.i18n.t;          // computed signal
 *   // In template: {{ t().nav.dashboard }}
 *
 * The service derives its language from the NgRx settings slice,
 * so switching language via SettingsActions.setLanguage() instantly
 * updates every component that uses t().
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly store = inject(Store);

  /** Current language as a signal */
  readonly lang = toSignal(
    this.store.select(selectLanguage),
    { initialValue: 'en' as Language },
  );

  /** Full translation map as a computed signal — updates on lang change */
  readonly t = computed<Translations>(() => TRANSLATIONS[this.lang()]);

  /** Helper for components that just want the current language string */
  get currentLang(): Language {
    return this.lang();
  }

  /** Human-readable language label */
  readonly langLabel = computed(() =>
    this.lang() === 'ms' ? 'BM' : 'EN',
  );

  /** All supported languages for the switcher */
  readonly supportedLanguages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: 'en', label: 'English',         nativeLabel: 'English'        },
    { code: 'ms', label: 'Bahasa Malaysia',  nativeLabel: 'Bahasa Melayu'  },
  ];
}
