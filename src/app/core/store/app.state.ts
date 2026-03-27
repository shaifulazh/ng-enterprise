import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router/router.serializer';
import { AuthState } from './auth/auth.state';
import { LayoutState } from './layout/layout.state';
import { SettingsState } from './settings/settings.state';

export interface AppState {
  router:   RouterReducerState<RouterStateUrl>;
  auth:     AuthState;
  layout:   LayoutState;
  settings: SettingsState;
}
