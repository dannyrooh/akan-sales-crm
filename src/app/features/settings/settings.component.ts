import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api/api.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <h2>Configurações</h2>
      </div>

      <div class="settings-grid">
        <div class="settings-section">
          <h3><i class="pi pi-mobile"></i> App Mobile</h3>
          <div class="setting-row">
            <div class="setting-info">
              <label>URL do App Mobile</label>
              <p>URL para redirecionamento de dispositivos móveis</p>
            </div>
            <input
              type="url"
              [(ngModel)]="mobileUrl"
              placeholder="https://m.akan.webmadria.com"
              class="setting-input"
            />
          </div>
          <button class="save-btn" (click)="saveMobileUrl()">
            <i class="pi pi-check"></i>
            Salvar
          </button>
        </div>

        <div class="settings-section">
          <h3><i class="pi pi-arrow-right-arrow-left"></i> Pipeline</h3>
          <div class="pipeline-stages">
            @for (stage of stages(); track stage.id) {
              <div class="stage-item">
                <div class="stage-color" [style.background]="stage.color"></div>
                <span class="stage-order">{{ stage.display_order }}</span>
                <span class="stage-name">{{ stage.name }}</span>
              </div>
            }
          </div>
          <p class="hint">Configuração avançada de estágios disponível em breve</p>
        </div>

        <div class="settings-section">
          <h3><i class="pi pi-users"></i> Usuários</h3>
          <p class="hint">Gerenciamento de usuários disponível em breve</p>
        </div>

        <div class="settings-section">
          <h3><i class="pi pi-link"></i> Integrações</h3>
          <div class="integration-row">
            <div class="integration-icon">
              <i class="pi pi-whatsapp"></i>
            </div>
            <div class="integration-info">
              <span class="integration-name">WhatsApp Cloud API</span>
              <span class="integration-status">
                Gerenciado pelo akan-sales-agent
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header h2 {
      font-size: 20px;
      font-weight: 700;
    }

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .settings-section {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 20px;
    }

    .settings-section h3 {
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .settings-section h3 i {
      color: var(--akan-primary);
    }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 12px;
    }

    .setting-info label {
      font-size: 13px;
      font-weight: 600;
      display: block;
    }

    .setting-info p {
      font-size: 12px;
      color: var(--akan-text-muted);
      margin-top: 2px;
    }

    .setting-input {
      width: 300px;
      padding: 8px 12px;
      background: var(--akan-bg);
      border: 1px solid var(--akan-border);
      border-radius: 6px;
      color: var(--akan-text);
      font-size: 13px;
      outline: none;
    }

    .setting-input:focus {
      border-color: var(--akan-primary);
    }

    .save-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--akan-primary);
      border: none;
      border-radius: 6px;
      color: white;
      font-size: 13px;
      cursor: pointer;
    }

    .pipeline-stages {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 12px;
    }

    .stage-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: var(--akan-bg);
      border-radius: 6px;
    }

    .stage-color {
      width: 12px;
      height: 12px;
      border-radius: 3px;
    }

    .stage-order {
      font-size: 11px;
      color: var(--akan-text-muted);
      width: 16px;
    }

    .stage-name {
      font-size: 13px;
    }

    .hint {
      font-size: 12px;
      color: var(--akan-text-muted);
    }

    .integration-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--akan-bg);
      border-radius: 8px;
    }

    .integration-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: rgba(34, 197, 94, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .integration-icon i {
      color: var(--akan-success);
      font-size: 18px;
    }

    .integration-info {
      display: flex;
      flex-direction: column;
    }

    .integration-name {
      font-size: 13px;
      font-weight: 600;
    }

    .integration-status {
      font-size: 11px;
      color: var(--akan-text-muted);
    }
  `]
})
export class SettingsComponent implements OnInit {
  private api = inject(ApiService);

  mobileUrl = '';
  readonly stages = signal<{ id: number; name: string; color: string; display_order: number }[]>([
    { id: 1, name: 'Novo Lead', color: '#6366f1', display_order: 1 },
    { id: 2, name: 'AI Contactou', color: '#8b5cf6', display_order: 2 },
    { id: 3, name: 'Qualificado', color: '#f59e0b', display_order: 3 },
    { id: 4, name: 'Proposta Enviada', color: '#3b82f6', display_order: 4 },
    { id: 5, name: 'Negociação', color: '#f97316', display_order: 5 },
    { id: 6, name: 'Ganho', color: '#22c55e', display_order: 6 },
    { id: 7, name: 'Perdido', color: '#ef4444', display_order: 7 },
  ]);

  ngOnInit(): void {
    this.api.get<{ value: string }>('/settings/mobile-url').subscribe({
      next: data => this.mobileUrl = data.value,
      error: () => {},
    });
  }

  saveMobileUrl(): void {
    this.api.put('/settings/mobile_app_url', { value: this.mobileUrl }).subscribe();
  }
}
