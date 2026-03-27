import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { StatCard, ActivityItem } from './dashboard.state';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Load Stats':           emptyProps(),
    'Load Stats Success':   props<{ stats: StatCard[] }>(),
    'Load Stats Failure':   props<{ error: string }>(),
    'Load Activity':        emptyProps(),
    'Load Activity Success': props<{ activity: ActivityItem[] }>(),
    'Load Activity Failure': props<{ error: string }>(),
  },
});
