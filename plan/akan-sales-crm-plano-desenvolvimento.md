# Plano de Desenvolvimento - Akan Sales CRM (Angular 21)

## Contexto

O projeto **akan-sales-crm** será o painel desktop de gerenciamento de vendas que se integra ao backend existente **akan-sales-agent** (FastAPI + Claude AI + WhatsApp). Atualmente o backend já possui:
- Agente IA conversacional com Claude (SPIN Selling + BANT scoring)
- Integração WhatsApp Cloud API
- PostgreSQL 16 + Redis 7
- Tabelas `leads` e `conversations`
- 3 tools: `calculate_pricing`, `calculate_lead_score`, `schedule_meeting`
- Apenas 2 endpoints: `/health` e `/webhook`

**Problema:** Não existe interface visual para gerenciar leads, pipeline, conversas e métricas. O CRM resolverá isso.

**Resultado esperado:** Um CRM desktop completo com dashboard, Kanban pipeline, visualização de conversas da IA, lead scoring BANT, e relatórios de performance.

---

## Arquitetura do Sistema

```
┌──────────────────┐      REST/JSON      ┌─────────────────────┐      ┌────────────┐
│  Angular 21 CRM  │ ◄──────────────────► │  FastAPI BFF Layer  │ ◄──► │ PostgreSQL │
│  (Desktop SPA)   │                      │  (akan-sales-agent) │      │ + Redis    │
└────────┬─────────┘                      └──────────┬──────────┘      └────────────┘
         │                                           │
         │ Device Detection                          │ Claude AI + WhatsApp
         ▼                                           ▼
   Mobile Redirect                             Leads via Landing Pages
   (URL em config)                             → IA Conversacional
```

**Decisões arquiteturais:**
1. **BFF no backend existente** - Estender `akan-sales-agent` com rotas `/api/v1/*` (evita duplicar infra)
2. **Estado com Signals** - Sem NgRx/RxJS store; usar `signal()`, `computed()`, `rxResource()`
3. **PrimeNG 21** - Biblioteca de componentes (DataTable, Charts, DragDrop)
4. **TailwindCSS 4** - Estilização utility-first
5. **Zoneless** - Angular 21 sem zone.js por padrão
6. **Vitest** - Testes unitários (padrão Angular 21)

---

## Estrutura de Pastas do CRM

```
akan-sales-crm/
├── angular.json
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
├── .env.example
├── src/
│   ├── index.html
│   ├── main.ts                          # bootstrapApplication (zoneless)
│   ├── styles.css                       # Tailwind + PrimeNG theme
│   ├── environments/
│   │   ├── environment.ts               # apiUrl, mobileAppUrl
│   │   └── environment.prod.ts
│   └── app/
│       ├── app.component.ts
│       ├── app.config.ts                # providers (router, http, interceptors)
│       ├── app.routes.ts                # Lazy-loaded feature routes
│       │
│       ├── core/                        # Singletons: services, guards, interceptors
│       │   ├── auth/
│       │   │   ├── auth.service.ts      # JWT login/logout, currentUser signal
│       │   │   ├── auth.guard.ts        # Protege rotas autenticadas
│       │   │   ├── auth.interceptor.ts  # Anexa Bearer token
│       │   │   └── role.guard.ts        # Controle por papel (admin/manager/rep)
│       │   ├── api/
│       │   │   ├── api.service.ts       # Wrapper HTTP tipado
│       │   │   └── api.interceptor.ts   # Error handling global, 401 redirect
│       │   ├── device/
│       │   │   └── device-detection.service.ts  # Detecta mobile, redireciona
│       │   ├── layout/
│       │   │   ├── shell/               # Layout principal (sidebar + topbar + content)
│       │   │   ├── sidebar/             # Menu lateral com navegação
│       │   │   └── topbar/              # Barra superior com user info
│       │   └── config/
│       │       └── environment.ts       # Constantes da aplicação
│       │
│       ├── features/                    # Features lazy-loaded
│       │   ├── auth/login/              # Tela de login (Signal Forms)
│       │   ├── dashboard/               # KPIs, charts, funnel, activity feed
│       │   ├── leads/                   # Lista, detalhe, form, score, timeline
│       │   ├── pipeline/                # Kanban board drag-and-drop
│       │   ├── conversations/           # Chat viewer das conversas da IA
│       │   ├── activities/              # Tarefas, reuniões, chamadas
│       │   ├── reports/                 # Funil, revenue, performance
│       │   └── settings/               # Users, pipeline config, mobile URL
│       │
│       └── shared/                      # Componentes reutilizáveis
│           ├── components/              # score-gauge, status-badge, data-table, etc.
│           ├── pipes/                   # relative-time, currency-brl, phone-format
│           ├── directives/              # click-outside, autofocus
│           └── utils/                   # date, score, validators
└── e2e/                                 # Playwright E2E tests
```

---

## Fases de Implementação

### Fase 1: Fundação (Scaffold + Auth + Layout)

**Angular CRM:**
1. Gerar projeto Angular 21: `ng new akan-sales-crm --style css --ssr false`
2. Instalar dependências: PrimeNG 21, TailwindCSS 4, Chart.js, Angular CDK, Vitest, Playwright
3. Configurar TailwindCSS 4 e tema PrimeNG (Aura)
4. Configurar environments (`apiUrl`, `mobileAppUrl`)
5. Implementar `DeviceDetectionService` - detecta mobile e redireciona para URL do config
6. Implementar `AuthService` - login JWT, token storage, signal `currentUser`
7. Implementar `AuthGuard`, `RoleGuard`, `AuthInterceptor`, `ApiInterceptor`
8. Construir layout shell: sidebar com navegação, topbar com info do usuário
9. Tela de login com Signal Forms
10. Configurar `app.routes.ts` com lazy loading por feature

**Backend (akan-sales-agent):**
1. Criar tabela `users` + migration SQL
2. Implementar rotas auth: `POST /api/v1/auth/login`, `/refresh`, `GET /me`
3. Middleware JWT + role guards
4. Configurar CORS para `http://localhost:4200`
5. Seed de usuário admin inicial

**Entregável:** Login funcional, rotas protegidas, layout desktop com sidebar

---

### Fase 2: Gestão de Leads

**Angular CRM:**
1. Modelos: `Lead`, `LeadFilter`, `LeadScoreDetails` (BANT breakdown)
2. `LeadsService` com `rxResource` - estado signal-based, paginação, filtros
3. **Lead List** - PrimeNG DataTable com:
   - Paginação, ordenação, busca
   - Badges de classificação (Quente/Morno/Frio) com `@switch`
   - Coluna de score com progress bar
   - Ações rápidas (ver, editar, mover estágio)
4. **Lead Detail** - Visão completa:
   - Score gauge circular (0-100)
   - Radar chart BANT (Budget/Authority/Need/Timeline)
   - Timeline de atividades + conversas
   - Form de edição (Signal Forms)
5. **Lead Form** - Criar/editar lead com validação
6. Pipes: `relative-time`, `phone-format`, `currency-brl`

**Backend:**
1. Estender tabela `leads`: email, company_name, source, assigned_to, pipeline_stage_id, bant_*, deal_value
2. Rotas CRUD: `GET/POST/PUT/DELETE /api/v1/leads`, `GET /leads/:id/timeline`
3. Paginação, filtros, ordenação nas queries

**Entregável:** Lista de leads pesquisável, detalhe com BANT visual, CRUD completo

---

### Fase 3: Pipeline Kanban

**Angular CRM:**
1. `PipelineService` - estado dos estágios e leads por estágio
2. **Pipeline Board** - Kanban com Angular CDK DragDrop:
   - Colunas para cada estágio (configurável)
   - Cards arrastáveis: nome, empresa, valor, badge de classificação
   - Header da coluna: contagem de leads + valor total
   - Atualização otimista (move local → envia API → reverte se falhar)
3. **Pipeline Card** - Componente de card do lead
4. **Pipeline Config** - Admin pode reordenar/renomear/colorir estágios

**Backend:**
1. Criar tabela `pipeline_stages` com stages default:
   - Novo Lead → AI Contactou → Qualificado → Proposta Enviada → Negociação → Ganho → Perdido
2. Rotas: `GET /pipeline/board`, `PATCH /leads/:id/stage`, `PATCH /pipeline/reorder`

**Entregável:** Board Kanban drag-and-drop funcional com estágios customizáveis

---

### Fase 4: Conversas da IA

**Angular CRM:**
1. `ConversationsService` - histórico de mensagens por lead
2. **Conversation View** estilo WhatsApp:
   - Painel esquerdo: lista de leads com preview da última mensagem
   - Painel direito: histórico completo com message bubbles
   - Indicador "IA atendeu" vs "Humano"
   - Auto-refresh a cada 15s (polling configurável)
3. **Envio manual de mensagem** - Operador pode intervir, dispara `SalesAgent.handle_message()`
4. **Message Bubble** - Componente estilizado por remetente

**Backend:**
1. Rotas: `GET /leads/:id/conversations`, `POST /leads/:id/conversations`
2. POST aciona o `SalesAgent.handle_message()` existente
3. Busca e filtro de conversas

**Entregável:** Viewer de conversas da IA, intervenção manual do operador

**Arquivos existentes relevantes:**
- `akan-sales-agent/src/agent/sales_agent.py` → `handle_message()` (linha ~40)
- `akan-sales-agent/src/database/repositories/conversation_repo.py` → `get_history()`

---

### Fase 5: Dashboard + Atividades

**Angular CRM:**
1. **Dashboard** com componentes `@defer (on viewport)`:
   - KPI Cards: Total leads, Novos esta semana, Taxa conversão, Revenue pipeline, Reuniões agendadas
   - Bar chart: leads por estágio do pipeline
   - Funil de conversão: taxa estágio-a-estágio
   - Feed de atividades recentes
   - Forecast de receita (line chart)
2. **Activities** - CRUD de atividades:
   - Tipos: chamada, reunião, email, tarefa, nota, whatsapp
   - Filtros por usuário, lead, tipo, status
   - Form com Signal Forms (título, descrição, data agendada)
   - Marcar como concluída

**Backend:**
1. Criar tabela `activities`
2. Rotas: `GET/POST/PUT /activities`, `PATCH /activities/:id/complete`
3. Rotas dashboard: `GET /dashboard/kpis`, `/pipeline-summary`, `/activity-feed`
4. Queries de agregação para KPIs

**Entregável:** Dashboard com KPIs em tempo real, gestão de atividades

---

### Fase 6: Relatórios + Settings + Polish

**Angular CRM:**
1. **Reports** (admin/manager only):
   - Funil de conversão com taxas percentuais
   - Tabela de performance por vendedor
   - Gráfico de receita mensal
   - Filtros por período (Signal Forms)
2. **Settings** (admin only):
   - Gerenciamento de usuários (CRUD)
   - Configuração do pipeline (estágios)
   - URL do app mobile
   - Integrações (WhatsApp status)
3. **Polish:**
   - Toast notifications (PrimeNG Toast)
   - Loading skeletons e empty states
   - Auditoria de acessibilidade (teclado, ARIA)
   - Otimização de performance
4. **Testes:**
   - Unit tests com Vitest (target 80%+ cobertura)
   - E2E com Playwright (login, CRUD leads, pipeline drag-drop, conversas)

**Backend:**
1. Rotas de relatórios: `/reports/conversion-funnel`, `/revenue`, `/performance`
2. Rotas de settings: `GET/PUT /settings`
3. Rotas de users: `GET/POST/PUT /users`
4. Índices no banco para queries de relatórios

**Entregável:** Relatórios analíticos, painel admin completo, testes abrangentes

---

## Dependências Principais

```
# Angular CRM
@angular/core: ^21.0.0          @angular/cdk: ^21.0.0
primeng: ^21.1.0                 chart.js: ^4.4.0
tailwindcss: ^4.0.0              vitest: ^3.0.0
@analogjs/vitest-angular: ^1.0   @playwright/test: ^1.50.0

# Backend (adicionar ao akan-sales-agent)
python-jose[cryptography]: >=3.3.0
passlib[bcrypt]: >=1.7.4
```

---

## Configuração de Ambiente

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api/v1',
  mobileAppUrl: 'https://m.akan.webmadria.com',  // URL do app mobile
  pollingIntervalMs: 15000,
};
```

```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.akan.webmadria.com/api/v1',
  mobileAppUrl: 'https://m.akan.webmadria.com',
  pollingIntervalMs: 30000,
};
```

---

## Schema do Banco (extensões necessárias)

### Novas Tabelas

| Tabela | Descrição |
|--------|-----------|
| `users` | Autenticação e controle de acesso (admin, manager, sales_rep) |
| `pipeline_stages` | Estágios do funil de vendas (7 stages default) |
| `activities` | Tarefas, reuniões, chamadas, notas |
| `companies` | Empresas associadas aos leads |
| `app_settings` | Configurações da aplicação (mobile URL, etc.) |

### Extensão da Tabela `leads`

Novas colunas: `email`, `company_name`, `source`, `assigned_to`, `pipeline_stage_id`, `bant_budget`, `bant_authority`, `bant_need`, `bant_timeline`, `deal_value`, `expected_close_date`, `lost_reason`

### Pipeline Stages Default

| Ordem | Estágio | Cor | Tipo |
|-------|---------|-----|------|
| 1 | Novo Lead | #6366f1 | Normal |
| 2 | AI Contactou | #8b5cf6 | Normal |
| 3 | Qualificado | #f59e0b | Normal |
| 4 | Proposta Enviada | #3b82f6 | Normal |
| 5 | Negociação | #f97316 | Normal |
| 6 | Ganho | #22c55e | Won |
| 7 | Perdido | #ef4444 | Lost |

---

## API Endpoints (Backend BFF)

### Autenticação
```
POST   /api/v1/auth/login           → JWT token
POST   /api/v1/auth/refresh         → Refresh token
GET    /api/v1/auth/me              → Perfil do usuário atual
```

### Dashboard
```
GET    /api/v1/dashboard/kpis              → Contagens, taxas, receita
GET    /api/v1/dashboard/pipeline-summary  → Leads por estágio
GET    /api/v1/dashboard/activity-feed     → Atividades recentes
```

### Leads
```
GET    /api/v1/leads                → Lista paginada, filtrável, ordenável
POST   /api/v1/leads                → Criar lead
GET    /api/v1/leads/:id            → Detalhe do lead
PUT    /api/v1/leads/:id            → Atualizar lead
DELETE /api/v1/leads/:id            → Soft delete
PATCH  /api/v1/leads/:id/stage      → Mover estágio no pipeline
GET    /api/v1/leads/:id/timeline   → Timeline de atividades + conversas
GET    /api/v1/leads/:id/score      → Detalhes do score BANT
```

### Pipeline
```
GET    /api/v1/pipeline/stages      → Todos estágios com contagens
GET    /api/v1/pipeline/board       → Dados do Kanban (leads agrupados)
PATCH  /api/v1/pipeline/reorder     → Reordenar lead entre estágios
```

### Conversas
```
GET    /api/v1/leads/:id/conversations  → Histórico de conversas
POST   /api/v1/leads/:id/conversations  → Enviar mensagem manual (aciona IA)
```

### Atividades
```
GET    /api/v1/activities                → Lista filtrável
POST   /api/v1/activities                → Criar atividade
PUT    /api/v1/activities/:id            → Atualizar
PATCH  /api/v1/activities/:id/complete   → Marcar como concluída
```

### Usuários
```
GET    /api/v1/users                → Lista (admin/manager)
POST   /api/v1/users                → Criar (admin)
PUT    /api/v1/users/:id            → Atualizar
```

### Settings
```
GET    /api/v1/settings             → Todas configurações
PUT    /api/v1/settings/:key        → Atualizar configuração
GET    /api/v1/settings/mobile-url  → URL do app mobile
```

### Relatórios
```
GET    /api/v1/reports/conversion-funnel  → Dados do funil
GET    /api/v1/reports/revenue            → Forecast de receita
GET    /api/v1/reports/performance        → Performance por vendedor
```

---

## Padrões Técnicos Angular 21

### Signal-Based State Service

```typescript
@Injectable({ providedIn: 'root' })
export class LeadsService {
  private http = inject(HttpClient);
  readonly filter = signal<LeadFilter>({ page: 1, pageSize: 20 });

  readonly leadsResource = rxResource({
    request: () => this.filter(),
    loader: ({ request: filter }) =>
      this.http.get<PaginatedResponse<Lead>>(`${environment.apiUrl}/leads`, {
        params: filter as any
      })
  });

  readonly leads = computed(() => this.leadsResource.value()?.data ?? []);
  readonly isLoading = computed(() => this.leadsResource.isLoading());
}
```

### New Control Flow

```html
@if (isLoading()) {
  <app-loading-skeleton />
} @else if (leads().length === 0) {
  <app-empty-state message="Nenhum lead encontrado" />
} @else {
  @for (lead of leads(); track lead.id) {
    <app-pipeline-card [lead]="lead" />
  }
}

@switch (lead.classification) {
  @case ('quente') { <span class="badge-hot">Quente</span> }
  @case ('morno')  { <span class="badge-warm">Morno</span> }
  @case ('frio')   { <span class="badge-cold">Frio</span> }
}
```

### Device Detection

```typescript
@Injectable({ providedIn: 'root' })
export class DeviceDetectionService {
  readonly isMobile = signal(this.detectMobile());
  readonly redirectOptOut = signal(
    localStorage.getItem('akan_desktop_optout') === 'true'
  );

  private detectMobile(): boolean {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent)
      || (navigator.maxTouchPoints > 0 && window.innerWidth < 768);
  }

  checkAndRedirect(): void {
    if (this.isMobile() && !this.redirectOptOut()) {
      window.location.href = environment.mobileAppUrl;
    }
  }
}
```

---

## Verificação

1. `ng serve` → CRM roda em `localhost:4200`
2. Login com usuário admin seed → Dashboard carrega KPIs
3. Criar lead → Aparece na lista e no pipeline
4. Arrastar lead no Kanban → Estágio atualiza no banco
5. Ver conversa de um lead → Mensagens da IA aparecem
6. `ng test` → Vitest roda com 80%+ cobertura
7. `npx playwright test` → E2E passa em todos os fluxos críticos
8. Acessar de mobile → Redireciona para URL configurada
