import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url:         string;
  params:      Record<string, string>;
  queryParams: Record<string, string>;
  data:        Record<string, unknown>;
  fragment:    string | null;
  title:       string | null;
}

@Injectable()
export class CustomRouterSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route: ActivatedRouteSnapshot = routerState.root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return {
      url:         routerState.url,
      params:      { ...route.params },
      queryParams: { ...routerState.root.queryParams },
      data:        { ...route.data },
      fragment:    routerState.root.fragment,
      title:       route.title?.toString() ?? null,
    };
  }
}
