import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: `
    <header class="topbar">
      <div class="topbar-left">
        <h2 class="page-title">{{ pageTitle() }}</h2>
      </div>

      <div class="topbar-right">
        <div class="user-info">
          <div class="user-avatar">
            {{ userInitials() }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ authService.currentUser()?.full_name }}</span>
            <span class="user-role">{{ roleLabel() }}</span>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: var(--topbar-height);
      background: var(--akan-surface);
      border-bottom: 1px solid var(--akan-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .page-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--akan-text);
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--akan-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 13px;
      color: white;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--akan-text);
    }

    .user-role {
      font-size: 11px;
      color: var(--akan-text-muted);
      text-transform: capitalize;
    }
  `]
})
export class TopbarComponent {
  readonly authService = inject(AuthService);

  pageTitle(): string {
    const path = window.location.pathname.split('/').pop() ?? 'dashboard';
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      leads: 'Leads',
      pipeline: 'Pipeline',
      conversations: 'Conversas',
      activities: 'Atividades',
      reports: 'Relatórios',
      settings: 'Configurações',
    };
    return titles[path] ?? 'Akan CRM';
  }

  userInitials(): string {
    const name = this.authService.currentUser()?.full_name ?? '';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  roleLabel(): string {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      manager: 'Gerente',
      sales_rep: 'Vendedor',
    };
    return labels[this.authService.currentUser()?.role ?? ''] ?? '';
  }
}
