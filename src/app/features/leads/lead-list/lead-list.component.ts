import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LeadsService } from '../leads.service';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="lead-list-page">
      <div class="page-header">
        <h2>Leads</h2>
        <div class="header-actions">
          <div class="search-box">
            <i class="pi pi-search"></i>
            <input
              type="text"
              placeholder="Buscar leads..."
              [ngModel]="searchTerm"
              (ngModelChange)="onSearch($event)"
            />
          </div>
          <select class="filter-select" (change)="onClassificationFilter($event)">
            <option value="">Todas classificações</option>
            <option value="quente">Quente</option>
            <option value="morno">Morno</option>
            <option value="frio">Frio</option>
          </select>
        </div>
      </div>

      @if (leadsService.isLoading()) {
        <div class="loading">
          <i class="pi pi-spinner pi-spin"></i>
          Carregando leads...
        </div>
      } @else if (leadsService.leads().length === 0) {
        <div class="empty-state">
          <i class="pi pi-users"></i>
          <h3>Nenhum lead encontrado</h3>
          <p>Leads aparecerão aqui quando forem capturados pelas landing pages</p>
        </div>
      } @else {
        <div class="leads-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Empresa</th>
                <th>Score</th>
                <th>Classificação</th>
                <th>Estágio</th>
                <th>Valor</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              @for (lead of leadsService.leads(); track lead.id) {
                <tr (click)="onSelectLead(lead.id)" class="lead-row">
                  <td class="lead-name">{{ lead.name }}</td>
                  <td>{{ lead.phone }}</td>
                  <td>{{ lead.company_name ?? '-' }}</td>
                  <td>
                    <div class="score-cell">
                      <div class="score-bar">
                        <div
                          class="score-fill"
                          [style.width.%]="lead.score"
                          [class.score-hot]="lead.score >= 80"
                          [class.score-warm]="lead.score >= 50 && lead.score < 80"
                          [class.score-cold]="lead.score < 50"
                        ></div>
                      </div>
                      <span class="score-value">{{ lead.score }}</span>
                    </div>
                  </td>
                  <td>
                    @switch (lead.classification) {
                      @case ('quente') { <span class="badge badge-hot">Quente</span> }
                      @case ('morno') { <span class="badge badge-warm">Morno</span> }
                      @case ('frio') { <span class="badge badge-cold">Frio</span> }
                    }
                  </td>
                  <td>{{ lead.pipeline_stage_name ?? '-' }}</td>
                  <td class="value-cell">R$ {{ lead.deal_value.toLocaleString('pt-BR') }}</td>
                  <td class="date-cell">{{ formatDate(lead.created_at) }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <span class="pagination-info">
            {{ leadsService.totalLeads() }} leads encontrados
          </span>
          <div class="pagination-controls">
            <button
              (click)="onPageChange(-1)"
              [disabled]="leadsService.filter().page <= 1"
            >
              <i class="pi pi-chevron-left"></i>
            </button>
            <span class="page-num">Página {{ leadsService.filter().page }}</span>
            <button
              (click)="onPageChange(1)"
              [disabled]="leadsService.leads().length < leadsService.filter().page_size"
            >
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .lead-list-page {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h2 {
      font-size: 20px;
      font-weight: 700;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 8px;
      padding: 8px 14px;
    }

    .search-box i {
      color: var(--akan-text-muted);
      font-size: 14px;
    }

    .search-box input {
      background: none;
      border: none;
      color: var(--akan-text);
      font-size: 13px;
      outline: none;
      width: 200px;
    }

    .filter-select {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 8px;
      padding: 8px 14px;
      color: var(--akan-text);
      font-size: 13px;
      outline: none;
      cursor: pointer;
    }

    .loading, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: var(--akan-text-muted);
      gap: 12px;
    }

    .empty-state i {
      font-size: 48px;
      opacity: 0.3;
    }

    .empty-state h3 {
      font-size: 16px;
      color: var(--akan-text);
    }

    .empty-state p {
      font-size: 13px;
    }

    .leads-table {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 12px;
      overflow: hidden;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead th {
      background: var(--akan-bg);
      padding: 12px 16px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: var(--akan-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
      border-bottom: 1px solid var(--akan-border);
    }

    tbody td {
      padding: 12px 16px;
      font-size: 13px;
      border-bottom: 1px solid var(--akan-border);
    }

    .lead-row {
      cursor: pointer;
      transition: background 0.1s;
    }

    .lead-row:hover {
      background: var(--akan-surface-hover);
    }

    .lead-name {
      font-weight: 600;
      color: var(--akan-text);
    }

    .score-cell {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .score-bar {
      width: 60px;
      height: 6px;
      background: var(--akan-bg);
      border-radius: 3px;
      overflow: hidden;
    }

    .score-fill {
      height: 100%;
      border-radius: 3px;
    }

    .score-hot { background: var(--akan-danger); }
    .score-warm { background: var(--akan-warning); }
    .score-cold { background: var(--akan-info); }

    .score-value {
      font-weight: 600;
      font-size: 12px;
      min-width: 24px;
    }

    .value-cell {
      font-weight: 500;
    }

    .date-cell {
      color: var(--akan-text-muted);
      font-size: 12px;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }

    .pagination-info {
      font-size: 13px;
      color: var(--akan-text-muted);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pagination-controls button {
      background: var(--akan-surface);
      border: 1px solid var(--akan-border);
      border-radius: 6px;
      padding: 6px 10px;
      color: var(--akan-text);
      cursor: pointer;
    }

    .pagination-controls button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-num {
      font-size: 13px;
      color: var(--akan-text-muted);
    }
  `]
})
export class LeadListComponent implements OnInit {
  readonly leadsService = inject(LeadsService);
  private router = inject(Router);

  searchTerm = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.leadsService.loadLeads();
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.leadsService.setFilter({ search: term, page: 1 });
    }, 400);
  }

  onClassificationFilter(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.leadsService.setFilter({ classification: value || undefined, page: 1 });
  }

  onSelectLead(id: number): void {
    this.router.navigate(['/leads', id]);
  }

  onPageChange(delta: number): void {
    const current = this.leadsService.filter().page;
    this.leadsService.setFilter({ page: current + delta });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }
}
