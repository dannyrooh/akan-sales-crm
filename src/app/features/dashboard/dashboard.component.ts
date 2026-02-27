import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ApiService } from '../../core/api/api.service';

interface DashboardKpis {
  total_leads: number;
  new_leads_week: number;
  conversion_rate: number;
  pipeline_value: number;
  meetings_scheduled: number;
  avg_score: number;
}

interface PipelineSummary {
  stage_name: string;
  stage_color: string;
  lead_count: number;
  total_value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <div class="kpi-grid">
        @for (kpi of kpiCards(); track kpi.label) {
          <div class="kpi-card">
            <div class="kpi-icon" [style.background]="kpi.iconBg">
              <i [class]="kpi.icon"></i>
            </div>
            <div class="kpi-content">
              <span class="kpi-value">{{ kpi.value }}</span>
              <span class="kpi-label">{{ kpi.label }}</span>
            </div>
          </div>
        }
      </div>

      <div class="dashboard-grid">
        <div class="card pipeline-overview">
          <h3>Pipeline Overview</h3>
          <div class="pipeline-bars">
            @for (stage of pipelineSummary(); track stage.stage_name) {
              <div class="pipeline-bar-row">
                <span class="stage-name">{{ stage.stage_name }}</span>
                <div class="bar-container">
                  <div
                    class="bar-fill"
                    [style.width.%]="getBarWidth(stage.lead_count)"
                    [style.background]="stage.stage_color"
                  ></div>
                </div>
                <span class="stage-count">{{ stage.lead_count }}</span>
              </div>
            } @empty {
              <p class="empty-text">Nenhum dado disponível</p>
            }
          </div>
        </div>

        <div class="card recent-activity">
          <h3>Atividades Recentes</h3>
          <div class="activity-list">
            <p class="empty-text">Conecte ao backend para ver atividades</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .kpi-card {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .kpi-content {
      display: flex;
      flex-direction: column;
    }

    .kpi-value {
      font-size: 24px;
      font-weight: 700;
      color: var(--akan-text);
    }

    .kpi-label {
      font-size: 12px;
      color: var(--akan-text-muted);
      margin-top: 2px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }

    .card {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 20px;
    }

    .card h3 {
      font-size: 15px;
      font-weight: 600;
      color: var(--akan-text);
      margin-bottom: 16px;
    }

    .pipeline-bars {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pipeline-bar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stage-name {
      width: 140px;
      font-size: 13px;
      color: var(--akan-text-muted);
      flex-shrink: 0;
    }

    .bar-container {
      flex: 1;
      height: 8px;
      background: var(--akan-bg);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
      min-width: 4px;
    }

    .stage-count {
      width: 32px;
      text-align: right;
      font-size: 13px;
      font-weight: 600;
      color: var(--akan-text);
    }

    .empty-text {
      color: var(--akan-text-muted);
      font-size: 13px;
      text-align: center;
      padding: 20px 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);

  readonly kpis = signal<DashboardKpis>({
    total_leads: 0,
    new_leads_week: 0,
    conversion_rate: 0,
    pipeline_value: 0,
    meetings_scheduled: 0,
    avg_score: 0,
  });

  readonly pipelineSummary = signal<PipelineSummary[]>([
    { stage_name: 'Novo Lead', stage_color: '#6366f1', lead_count: 0, total_value: 0 },
    { stage_name: 'AI Contactou', stage_color: '#8b5cf6', lead_count: 0, total_value: 0 },
    { stage_name: 'Qualificado', stage_color: '#f59e0b', lead_count: 0, total_value: 0 },
    { stage_name: 'Proposta Enviada', stage_color: '#3b82f6', lead_count: 0, total_value: 0 },
    { stage_name: 'Negociação', stage_color: '#f97316', lead_count: 0, total_value: 0 },
    { stage_name: 'Ganho', stage_color: '#22c55e', lead_count: 0, total_value: 0 },
    { stage_name: 'Perdido', stage_color: '#ef4444', lead_count: 0, total_value: 0 },
  ]);

  readonly kpiCards = computed(() => {
    const k = this.kpis();
    return [
      { label: 'Total Leads', value: k.total_leads, icon: 'pi pi-users', iconBg: '#6366f1' },
      { label: 'Novos (Semana)', value: k.new_leads_week, icon: 'pi pi-user-plus', iconBg: '#22c55e' },
      { label: 'Taxa Conversão', value: `${k.conversion_rate}%`, icon: 'pi pi-percentage', iconBg: '#f59e0b' },
      { label: 'Pipeline (R$)', value: k.pipeline_value.toLocaleString('pt-BR'), icon: 'pi pi-dollar', iconBg: '#3b82f6' },
      { label: 'Reuniões', value: k.meetings_scheduled, icon: 'pi pi-calendar', iconBg: '#8b5cf6' },
      { label: 'Score Médio', value: k.avg_score, icon: 'pi pi-chart-line', iconBg: '#f97316' },
    ];
  });

  private maxLeadCount = computed(() => {
    const counts = this.pipelineSummary().map(s => s.lead_count);
    return Math.max(...counts, 1);
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  getBarWidth(count: number): number {
    return (count / this.maxLeadCount()) * 100;
  }

  private loadDashboard(): void {
    this.api.get<DashboardKpis>('/dashboard/kpis').subscribe({
      next: data => this.kpis.set(data),
      error: () => {},
    });

    this.api.get<PipelineSummary[]>('/dashboard/pipeline-summary').subscribe({
      next: data => this.pipelineSummary.set(data),
      error: () => {},
    });
  }
}
