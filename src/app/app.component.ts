import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { SettingsActions } from './core/store/settings/settings.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    // Rehydrate persisted settings (theme, language) on boot
    this.store.dispatch(SettingsActions.loadFromStorage());
  }
}
