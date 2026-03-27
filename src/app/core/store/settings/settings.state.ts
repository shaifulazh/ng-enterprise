// settings.state.ts
export type Theme    = 'light' | 'dark' | 'system';
export type Language = 'en' | 'ms';

export interface SettingsState {
  theme:    Theme;
  language: Language;
}

export const initialSettingsState: SettingsState = {
  theme:    'system',
  language: 'en',
};
