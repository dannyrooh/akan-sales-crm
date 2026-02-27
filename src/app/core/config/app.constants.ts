export const PIPELINE_STAGES = {
  NEW_LEAD: { id: 1, name: 'Novo Lead', color: '#6366f1', icon: 'pi pi-user-plus' },
  AI_CONTACTED: { id: 2, name: 'AI Contactou', color: '#8b5cf6', icon: 'pi pi-comments' },
  QUALIFIED: { id: 3, name: 'Qualificado', color: '#f59e0b', icon: 'pi pi-check-circle' },
  PROPOSAL_SENT: { id: 4, name: 'Proposta Enviada', color: '#3b82f6', icon: 'pi pi-file' },
  NEGOTIATION: { id: 5, name: 'Negociação', color: '#f97316', icon: 'pi pi-sync' },
  WON: { id: 6, name: 'Ganho', color: '#22c55e', icon: 'pi pi-trophy' },
  LOST: { id: 7, name: 'Perdido', color: '#ef4444', icon: 'pi pi-times-circle' },
} as const;

export const LEAD_CLASSIFICATIONS = {
  HOT: { label: 'Quente', class: 'badge-hot', minScore: 80 },
  WARM: { label: 'Morno', class: 'badge-warm', minScore: 50 },
  COLD: { label: 'Frio', class: 'badge-cold', minScore: 0 },
} as const;

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Chamada', icon: 'pi pi-phone' },
  { value: 'meeting', label: 'Reunião', icon: 'pi pi-calendar' },
  { value: 'email', label: 'Email', icon: 'pi pi-envelope' },
  { value: 'task', label: 'Tarefa', icon: 'pi pi-check-square' },
  { value: 'note', label: 'Nota', icon: 'pi pi-file-edit' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'pi pi-whatsapp' },
] as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  SALES_REP: 'sales_rep',
} as const;
