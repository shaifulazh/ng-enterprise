import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Theme, Language } from './settings.state';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Set Theme':          props<{ theme: Theme }>(),
    'Set Language':       props<{ language: Language }>(),
    'Load From Storage':  emptyProps(),
    'Restore Settings':   props<{ theme: Theme; language: Language }>(),
  },
});
