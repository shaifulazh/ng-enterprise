import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopNavbarComponent } from './top-navbar.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-surface-tertiary dark:bg-surface-dark">
      <app-sidebar />

      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <app-top-navbar />

        <main class="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none"
              tabindex="-1"
              id="main-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class LayoutShellComponent {}
