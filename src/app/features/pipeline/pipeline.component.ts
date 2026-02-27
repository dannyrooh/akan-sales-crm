import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { ApiService } from '../../core/api/api.service';

interface PipelineStage {
  id: number;
  name: string;
  color: string;
  leads: PipelineLead[];
  total_value: number;
}

interface PipelineLead {
  id: number;
  name: string;
  company_name?: string;
  score: number;
  classification: string;
  deal_value: number;
  phone: string;
}

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div class="pipeline-page">
      <div class="page-header">
        <h2>Pipeline</h2>
      </div>

      <div class="board" cdkDropListGroup>
        @for (stage of stages(); track stage.id) {
          <div class="column">
            <div class="column-header" [style.border-top-color]="stage.color">
              <div class="column-title">
                <span class="stage-name">{{ stage.name }}</span>
                <span class="stage-count">{{ stage.leads.length }}</span>
              </div>
              <span class="stage-value">
                R$ {{ stage.total_value.toLocaleString('pt-BR') }}
              </span>
            </div>

            <div
              class="column-body"
              cdkDropList
              [cdkDropListData]="stage"
              (cdkDropListDropped)="onDrop($event)"
              [id]="'stage-' + stage.id"
              [cdkDropListConnectedTo]="getConnectedLists(stage.id)"
            >
              @for (lead of stage.leads; track lead.id) {
                <div class="pipeline-card" cdkDrag [cdkDragData]="lead">
                  <div class="card-header">
                    <span class="card-name">{{ lead.name }}</span>
                    @switch (lead.classification) {
                      @case ('quente') { <span class="badge badge-hot">Q</span> }
                      @case ('morno') { <span class="badge badge-warm">M</span> }
                      @case ('frio') { <span class="badge badge-cold">F</span> }
                    }
                  </div>
                  @if (lead.company_name) {
                    <span class="card-company">{{ lead.company_name }}</span>
                  }
                  <div class="card-footer">
                    <span class="card-value">R$ {{ lead.deal_value.toLocaleString('pt-BR') }}</span>
                    <span class="card-score">Score: {{ lead.score }}</span>
                  </div>
                </div>
              } @empty {
                <div class="column-empty">
                  <span>Nenhum lead</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pipeline-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: calc(100vh - var(--topbar-height) - 48px);
    }

    .page-header h2 {
      font-size: 20px;
      font-weight: 700;
    }

    .board {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      flex: 1;
      padding-bottom: 8px;
    }

    .column {
      min-width: 280px;
      max-width: 280px;
      display: flex;
      flex-direction: column;
      background: var(--akan-bg);
      border-radius: 12px;
      overflow: hidden;
    }

    .column-header {
      padding: 14px 16px;
      background: var(--akan-surface);
      border-top: 3px solid;
    }

    .column-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stage-name {
      font-size: 13px;
      font-weight: 600;
    }

    .stage-count {
      background: var(--akan-bg);
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
    }

    .stage-value {
      font-size: 11px;
      color: var(--akan-text-muted);
      margin-top: 4px;
      display: block;
    }

    .column-body {
      flex: 1;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;
      min-height: 100px;
    }

    .pipeline-card {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 8px;
      padding: 12px;
      cursor: grab;
      transition: box-shadow 0.15s;
    }

    .pipeline-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .cdk-drag-preview {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    .cdk-drag-placeholder {
      opacity: 0.3;
    }

    .cdk-drag-animating {
      transition: transform 200ms ease;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .card-name {
      font-size: 13px;
      font-weight: 600;
    }

    .card-company {
      font-size: 11px;
      color: var(--akan-text-muted);
      display: block;
      margin-bottom: 8px;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-value {
      font-size: 12px;
      font-weight: 600;
      color: var(--akan-success);
    }

    .card-score {
      font-size: 11px;
      color: var(--akan-text-muted);
    }

    .column-empty {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: var(--akan-text-muted);
      font-size: 12px;
      opacity: 0.5;
    }
  `]
})
export class PipelineComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  readonly stages = signal<PipelineStage[]>([
    { id: 1, name: 'Novo Lead', color: '#6366f1', leads: [], total_value: 0 },
    { id: 2, name: 'AI Contactou', color: '#8b5cf6', leads: [], total_value: 0 },
    { id: 3, name: 'Qualificado', color: '#f59e0b', leads: [], total_value: 0 },
    { id: 4, name: 'Proposta Enviada', color: '#3b82f6', leads: [], total_value: 0 },
    { id: 5, name: 'Negociação', color: '#f97316', leads: [], total_value: 0 },
    { id: 6, name: 'Ganho', color: '#22c55e', leads: [], total_value: 0 },
    { id: 7, name: 'Perdido', color: '#ef4444', leads: [], total_value: 0 },
  ]);

  ngOnInit(): void {
    this.loadBoard();
  }

  getConnectedLists(stageId: number): string[] {
    return this.stages()
      .filter(s => s.id !== stageId)
      .map(s => 'stage-' + s.id);
  }

  onDrop(event: CdkDragDrop<PipelineStage, PipelineStage, PipelineLead>): void {
    if (event.previousContainer === event.container) return;

    const lead = event.item.data;
    const fromStage = event.previousContainer.data;
    const toStage = event.container.data;

    // Optimistic update
    this.stages.update(stages =>
      stages.map(s => {
        if (s.id === fromStage.id) {
          const leads = s.leads.filter(l => l.id !== lead.id);
          return { ...s, leads, total_value: leads.reduce((sum, l) => sum + l.deal_value, 0) };
        }
        if (s.id === toStage.id) {
          const leads = [...s.leads, lead];
          return { ...s, leads, total_value: leads.reduce((sum, l) => sum + l.deal_value, 0) };
        }
        return s;
      })
    );

    // Persist
    this.api.patch(`/leads/${lead.id}/stage`, { pipeline_stage_id: toStage.id }).subscribe({
      error: () => this.loadBoard(), // Revert on error
    });
  }

  private loadBoard(): void {
    this.api.get<PipelineStage[]>('/pipeline/board').subscribe({
      next: data => this.stages.set(data),
      error: () => {},
    });
  }
}
