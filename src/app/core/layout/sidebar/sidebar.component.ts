import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">A</span>
          <span class="logo-text">Akan CRM</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        @for (item of visibleNavItems(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="nav-active"
            class="nav-item"
          >
            <i [class]="item.icon"></i>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" (click)="onLogout()">
          <i class="pi pi-sign-out"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--akan-surface);
      border-right: 1px solid var(--akan-border);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
    }

    .sidebar-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--akan-border);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      background: var(--akan-primary);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
      color: white;
    }

    .logo-text {
      font-size: 18px;
      font-weight: 700;
      color: var(--akan-text);
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      overflow-y: auto;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      border-radius: 8px;
      color: var(--akan-text-muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s ease;
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }

    .nav-item:hover {
      background: var(--akan-surface-hover);
      color: var(--akan-text);
    }

    .nav-item i {
      font-size: 18px;
      width: 20px;
      text-align: center;
    }

    .nav-active {
      background: rgba(99, 102, 241, 0.15);
      color: var(--akan-primary) !important;
    }

    .sidebar-footer {
      padding: 12px 8px;
      border-top: 1px solid var(--akan-border);
    }

    .logout-btn {
      color: var(--akan-danger) !important;
    }

    .logout-btn:hover {
      background: rgba(239, 68, 68, 0.1) !important;
    }
  `]
})
export class SidebarComponent {
  private authService = inject(AuthService);

  private navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-objects-column', route: '/dashboard' },
    { label: 'Leads', icon: 'pi pi-users', route: '/leads' },
    { label: 'Pipeline', icon: 'pi pi-arrow-right-arrow-left', route: '/pipeline' },
    { label: 'Conversas', icon: 'pi pi-comments', route: '/conversations' },
    { label: 'Atividades', icon: 'pi pi-check-square', route: '/activities' },
    { label: 'Relatórios', icon: 'pi pi-chart-bar', route: '/reports', roles: ['admin', 'manager'] },
    { label: 'Configurações', icon: 'pi pi-cog', route: '/settings', roles: ['admin'] },
  ];

  readonly visibleNavItems = signal(
    this.navItems.filter(item => {
      if (!item.roles) return true;
      const role = this.authService.userRole();
      return role ? item.roles.includes(role) : false;
    })
  );

  onLogout(): void {
    this.authService.logout();
  }
}
