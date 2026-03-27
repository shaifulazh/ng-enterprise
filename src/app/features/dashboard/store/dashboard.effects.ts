import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DashboardActions } from './dashboard.actions';
import { DashboardApiService } from '../services/dashboard-api.service';

@Injectable()
export class DashboardEffects {
  private readonly actions$   = inject(Actions);
  private readonly dashApi    = inject(DashboardApiService);

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadStats),
      switchMap(() =>
        this.dashApi.getStats().pipe(
          map(stats => DashboardActions.loadStatsSuccess({ stats })),
          catchError(err =>
            of(DashboardActions.loadStatsFailure({ error: err.message ?? 'Failed to load stats' })),
          ),
        ),
      ),
    ),
  );

  loadActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadActivity),
      switchMap(() =>
        this.dashApi.getActivity().pipe(
          map(activity => DashboardActions.loadActivitySuccess({ activity })),
          catchError(err =>
            of(DashboardActions.loadActivityFailure({ error: err.message ?? 'Failed to load activity' })),
          ),
        ),
      ),
    ),
  );
}
