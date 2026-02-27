import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lead, LeadFilter } from './leads.models';
import { PaginatedResponse } from '../../core/api/api.service';

@Injectable({ providedIn: 'root' })
export class LeadsService {
  private http = inject(HttpClient);

  readonly filter = signal<LeadFilter>({ page: 1, page_size: 20 });
  readonly leadsData = signal<PaginatedResponse<Lead> | null>(null);
  readonly selectedLead = signal<Lead | null>(null);
  readonly isLoading = signal(false);

  readonly leads = computed(() => this.leadsData()?.data ?? []);
  readonly totalLeads = computed(() => this.leadsData()?.total ?? 0);

  async loadLeads(): Promise<void> {
    this.isLoading.set(true);
    try {
      const filter = this.filter();
      const params: Record<string, string | number> = {
        page: filter.page,
        page_size: filter.page_size,
      };
      if (filter.search) params['search'] = filter.search;
      if (filter.classification) params['classification'] = filter.classification;
      if (filter.pipeline_stage_id) params['pipeline_stage_id'] = filter.pipeline_stage_id;
      if (filter.sort_by) params['sort_by'] = filter.sort_by;
      if (filter.sort_order) params['sort_order'] = filter.sort_order;

      const data = await firstValueFrom(
        this.http.get<PaginatedResponse<Lead>>(`${environment.apiUrl}/leads`, { params })
      );
      this.leadsData.set(data);
    } catch {
      this.leadsData.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadLead(id: number): Promise<void> {
    this.isLoading.set(true);
    try {
      const lead = await firstValueFrom(
        this.http.get<Lead>(`${environment.apiUrl}/leads/${id}`)
      );
      this.selectedLead.set(lead);
    } catch {
      this.selectedLead.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateLeadStage(leadId: number, stageId: number): Promise<void> {
    await firstValueFrom(
      this.http.patch(`${environment.apiUrl}/leads/${leadId}/stage`, { pipeline_stage_id: stageId })
    );
    await this.loadLeads();
  }

  setFilter(partial: Partial<LeadFilter>): void {
    this.filter.update(f => ({ ...f, ...partial }));
    this.loadLeads();
  }
}
