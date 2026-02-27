import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <div class="reports-page">
      <div class="page-header">
        <h2>Relatórios</h2>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <div class="report-icon" style="background: rgba(99, 102, 241, 0.15);">
            <i class="pi pi-chart-bar" style="color: #6366f1;"></i>
          </div>
          <h3>Funil de Conversão</h3>
          <p>Taxas de conversão estágio a estágio</p>
        </div>

        <div class="report-card">
          <div class="report-icon" style="background: rgba(34, 197, 94, 0.15);">
            <i class="pi pi-dollar" style="color: #22c55e;"></i>
          </div>
          <h3>Receita</h3>
          <p>Forecast e histórico de receita mensal</p>
        </div>

        <div class="report-card">
          <div class="report-icon" style="background: rgba(245, 158, 11, 0.15);">
            <i class="pi pi-users" style="color: #f59e0b;"></i>
          </div>
          <h3>Performance</h3>
          <p>Métricas por vendedor e time</p>
        </div>

        <div class="report-card">
          <div class="report-icon" style="background: rgba(139, 92, 246, 0.15);">
            <i class="pi pi-comments" style="color: #8b5cf6;"></i>
          </div>
          <h3>IA Agent</h3>
          <p>Performance do agente conversacional</p>
        </div>
      </div>

      <div class="coming-soon">
        <i class="pi pi-chart-line"></i>
        <h3>Relatórios detalhados em breve</h3>
        <p>Conecte ao backend para visualizar dados completos com gráficos interativos</p>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .page-header h2 {
      font-size: 20px;
      font-weight: 700;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }

    .report-card {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 20px;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .report-card:hover {
      border-color: var(--akan-primary);
    }

    .report-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 14px;
    }

    .report-card h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .report-card p {
      font-size: 12px;
      color: var(--akan-text-muted);
    }

    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px;
      color: var(--akan-text-muted);
      gap: 8px;
    }

    .coming-soon i {
      font-size: 48px;
      opacity: 0.2;
    }

    .coming-soon h3 {
      color: var(--akan-text);
      font-size: 16px;
    }

    .coming-soon p {
      font-size: 13px;
    }
  `]
})
export class ReportsComponent {}
