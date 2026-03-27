import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AuthActions } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-callback',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center bg-surface dark:bg-surface-dark">
      <div class="text-center space-y-4">
        <div class="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center mx-auto">
          <svg class="w-6 h-6 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
        </div>
        <p class="text-sm text-slate-600 dark:text-slate-400">Completing sign in…</p>

        @if (error) {
          <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400 max-w-sm">
            {{ error }}
          </div>
        }
      </div>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(Store);

  error: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      const code  = params['code']  as string | undefined;
      const callbackState = params['state'] as string | undefined;
      const err   = params['error'] as string | undefined;

      if (err) {
        this.error = `Authorization failed: ${err}`;
        return;
      }

      if (!code || !callbackState) {
        this.error = 'Invalid callback — missing code or state.';
        return;
      }
      console.log("callback fired",code,callbackState)


      this.store.dispatch(AuthActions.exchangeCodeForToken({ code, callbackState }));
    });
  }
}
