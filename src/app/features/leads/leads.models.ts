export interface Lead {
  id: number;
  phone: string;
  name: string;
  email?: string;
  industry?: string;
  company_name?: string;
  source: string;
  score: number;
  classification: 'quente' | 'morno' | 'frio';
  assigned_to?: string;
  pipeline_stage_id: number;
  pipeline_stage_name?: string;
  bant_budget: boolean;
  bant_authority: boolean;
  bant_need: boolean;
  bant_timeline: boolean;
  deal_value: number;
  expected_close_date?: string;
  lost_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadFilter {
  page: number;
  page_size: number;
  search?: string;
  classification?: string;
  pipeline_stage_id?: number;
  assigned_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface LeadTimeline {
  id: number;
  type: 'activity' | 'conversation' | 'stage_change';
  title: string;
  description?: string;
  created_at: string;
}
