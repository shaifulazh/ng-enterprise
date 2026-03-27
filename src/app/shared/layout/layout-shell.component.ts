import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { TopNavbarComponent } from './top-navbar.component';
import { LoadingOverlayComponent } from '../components/loading-overlay.component';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopNavbarComponent, LoadingOverlayComponent],
  template: `
    <!--
      Root: full viewport, no overflow — sidebar never clips or scrolls independently.
      Flex row: sidebar (fixed height) + content column.
    -->
    <div class="flex h-screen w-screen overflow-hidden bg-surface-tertiary dark:bg-surface-dark">

      <!-- Sidebar: full screen height, sticky on desktop -->
      <app-sidebar />

      <!-- Content column: topbar + scrollable main -->
      <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
        <app-top-navbar />

        <main
          class="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none"
          tabindex="-1"
          id="main-content"
          aria-label="Main content"
        >
          <router-outlet />
        </main>
      </div>
    </div>

    <!-- Global HTTP loading overlay — sits above all content -->
    <app-loading-overlay />
  `,
})
export class LayoutShellComponent {}
