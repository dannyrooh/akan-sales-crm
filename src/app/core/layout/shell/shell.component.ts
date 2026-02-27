import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="shell">
      <app-sidebar />
      <div class="main-area">
        <app-topbar />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      min-height: 100vh;
    }

    .main-area {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
    }

    .content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
  `]
})
export class ShellComponent {}
