import { createFeatureSelector } from '@ngrx/store';
import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';
import { RouterStateUrl } from './router.serializer';

const selectRouterState =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
  selectTitle,
} = getRouterSelectors(selectRouterState);
