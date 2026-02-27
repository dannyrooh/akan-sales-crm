import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../leads.service';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  template: `
    <div class="lead-detail">
      @if (leadsService.isLoading()) {
        <div class="loading">
          <i class="pi pi-spinner pi-spin"></i>
          Carregando...
        </div>
      } @else if (leadsService.selectedLead(); as lead) {
        <div class="detail-header">
          <button class="back-btn" (click)="goBack()">
            <i class="pi pi-arrow-left"></i>
            Voltar
          </button>
          <div class="lead-title">
            <h2>{{ lead.name }}</h2>
            @switch (lead.classification) {
              @case ('quente') { <span class="badge badge-hot">Quente</span> }
              @case ('morno') { <span class="badge badge-warm">Morno</span> }
              @case ('frio') { <span class="badge badge-cold">Frio</span> }
            }
          </div>
        </div>

        <div class="detail-grid">
          <div class="info-card">
            <h3>Informações</h3>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Telefone</span>
                <span class="info-value">{{ lead.phone }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">{{ lead.email ?? '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Empresa</span>
                <span class="info-value">{{ lead.company_name ?? '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Indústria</span>
                <span class="info-value">{{ lead.industry ?? '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Origem</span>
                <span class="info-value">{{ lead.source }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Valor do Deal</span>
                <span class="info-value">R$ {{ lead.deal_value.toLocaleString('pt-BR') }}</span>
              </div>
            </div>
          </div>

          <div class="score-card">
            <h3>Lead Score</h3>
            <div class="score-display">
              <div class="score-circle"
                [class.score-hot]="lead.score >= 80"
                [class.score-warm]="lead.score >= 50 && lead.score < 80"
                [class.score-cold]="lead.score < 50"
              >
                <span class="score-number">{{ lead.score }}</span>
                <span class="score-label">/ 100</span>
              </div>
            </div>

            <h4>BANT Qualification</h4>
            <div class="bant-grid">
              <div class="bant-item" [class.bant-yes]="lead.bant_budget">
                <i class="pi" [class.pi-check-circle]="lead.bant_budget" [class.pi-circle]="!lead.bant_budget"></i>
                Budget
              </div>
              <div class="bant-item" [class.bant-yes]="lead.bant_authority">
                <i class="pi" [class.pi-check-circle]="lead.bant_authority" [class.pi-circle]="!lead.bant_authority"></i>
                Authority
              </div>
              <div class="bant-item" [class.bant-yes]="lead.bant_need">
                <i class="pi" [class.pi-check-circle]="lead.bant_need" [class.pi-circle]="!lead.bant_need"></i>
                Need
              </div>
              <div class="bant-item" [class.bant-yes]="lead.bant_timeline">
                <i class="pi" [class.pi-check-circle]="lead.bant_timeline" [class.pi-circle]="!lead.bant_timeline"></i>
                Timeline
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="empty-state">
          <p>Lead não encontrado</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .lead-detail {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .loading, .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
      color: var(--akan-text-muted);
      gap: 8px;
    }

    .detail-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: var(--akan-text-muted);
      cursor: pointer;
      font-size: 13px;
      padding: 4px 0;
      width: fit-content;
    }

    .back-btn:hover {
      color: var(--akan-text);
    }

    .lead-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .lead-title h2 {
      font-size: 22px;
      font-weight: 700;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }

    .info-card, .score-card {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      padding: 20px;
    }

    h3 {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    h4 {
      font-size: 13px;
      font-weight: 600;
      color: var(--akan-text-muted);
      margin: 20px 0 12px;
    }

    .info-rows {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid var(--akan-border);
    }

    .info-label {
      font-size: 13px;
      color: var(--akan-text-muted);
    }

    .info-value {
      font-size: 13px;
      font-weight: 500;
    }

    .score-display {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
    }

    .score-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border: 4px solid;
    }

    .score-circle.score-hot { border-color: var(--akan-danger); }
    .score-circle.score-warm { border-color: var(--akan-warning); }
    .score-circle.score-cold { border-color: var(--akan-info); }

    .score-number {
      font-size: 28px;
      font-weight: 700;
    }

    .score-label {
      font-size: 11px;
      color: var(--akan-text-muted);
    }

    .bant-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .bant-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--akan-bg);
      border-radius: 8px;
      font-size: 13px;
      color: var(--akan-text-muted);
    }

    .bant-yes {
      color: var(--akan-success);
    }
  `]
})
export class LeadDetailComponent implements OnInit {
  readonly leadsService = inject(LeadsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.leadsService.loadLead(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/leads']);
  }
}
