# Akan Sales CRM

CRM de vendas desktop integrado ao agente de IA conversacional **akan-sales-agent**. Gerencia leads, pipeline de vendas, conversas da IA e métricas de performance.

## Arquitetura

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

## Stack de Tecnologias

### Frontend Framework

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Angular** | 21.2 | Framework principal, standalone components, zoneless change detection |
| **TypeScript** | 5.9 | Tipagem estática com strict mode habilitado |
| **RxJS** | 7.8 | Programação reativa para streams HTTP |
| **Angular Signals** | built-in | Gerenciamento de estado reativo (substitui NgRx/RxJS stores) |

### UI e Estilização

| Tecnologia | Versão | Descrição |
|---|---|---|
| **TailwindCSS** | 4.2 | Framework CSS utility-first via PostCSS |
| **PrimeNG** | 21.1 | Biblioteca de componentes UI (DataTable, Charts, DragDrop) |
| **PrimeIcons** | 7.0 | Biblioteca de ícones integrada ao PrimeNG |
| **Chart.js** | 4.5 | Gráficos interativos (pipeline, funil, receita) |

### Testes

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Vitest** | 4.0 | Unit tests (runner padrão do Angular 21) |
| **Playwright** | 1.58 | Testes end-to-end cross-browser |
| **jsdom** | 28.0 | Ambiente DOM para testes unitários |

### Build e Tooling

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Angular CLI** | 21.2 | Scaffold, build, serve, test |
| **PostCSS** | 8.5 | Processamento CSS (integração TailwindCSS) |
| **Prettier** | 3.8 | Formatação de código |

### Backend (akan-sales-agent)

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Python** | 3.11+ | Linguagem do backend |
| **FastAPI** | 0.115+ | Framework REST API |
| **Anthropic Claude** | Sonnet 4 | IA conversacional (SPIN Selling + BANT) |
| **PostgreSQL** | 16 | Banco de dados principal |
| **Redis** | 7 | Cache e filas |
| **WhatsApp Cloud API** | v21.0 | Canal de comunicação com leads |

## Padrões Arquiteturais

### Angular 21

- **Standalone Components** - Sem NgModules, cada componente é auto-contido
- **Signals** - Estado reativo com `signal()`, `computed()` e `effect()` (sem NgRx)
- **Zoneless** - Change detection sem zone.js (padrão Angular 21)
- **New Control Flow** - `@if`, `@for`, `@switch`, `@defer` em vez de diretivas estruturais
- **Lazy Loading** - Cada feature é um chunk carregado sob demanda via `loadChildren`
- **Functional Guards** - `authGuard` e `roleGuard` como funções (sem classes)
- **HTTP Interceptors** - Funcionais via `withInterceptors()` (JWT e error handling)

### Estrutura de Pastas

```
src/app/
├── core/              # Singletons: auth, API, layout, device detection
│   ├── auth/          # JWT service, guard, role guard, interceptor
│   ├── api/           # HTTP wrapper tipado, error interceptor
│   ├── device/        # Detecção mobile → redirect para app mobile
│   ├── layout/        # Shell (sidebar + topbar + content area)
│   └── config/        # Constantes (pipeline stages, BANT, activity types)
├── features/          # Features lazy-loaded (1 route bundle por feature)
│   ├── dashboard/     # KPIs, pipeline chart, funil de conversão
│   ├── leads/         # Lista, detalhe, BANT radar, timeline, formulários
│   ├── pipeline/      # Kanban board com drag-and-drop (CDK)
│   ├── conversations/ # Chat viewer estilo WhatsApp (mensagens da IA)
│   ├── activities/    # CRUD de tarefas, reuniões, chamadas
│   ├── reports/       # Funil, receita, performance por vendedor
│   └── settings/      # Usuários, pipeline config, URL mobile, integrações
└── shared/            # Pipes, utils, componentes reutilizáveis
```

### Metodologias de Vendas Integradas

- **SPIN Selling** - Situation → Problem → Implication → Necessity
- **BANT Scoring** - Budget, Authority, Need, Timeline (score 0-100)
- **Pipeline Stages** - Novo Lead → AI Contactou → Qualificado → Proposta → Negociação → Ganho/Perdido

## Pré-requisitos

- **Node.js** 22.x (recomendado via `nvm use 22`)
- **npm** 10.x
- **Backend** akan-sales-agent rodando em `http://localhost:8000`

## Primeiros Passos

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:4200)
npm start

# Build de produção
npm run build

# Testes unitários (Vitest)
npm test

# Testes E2E (Playwright)
npx playwright test
```

## Configuração

### Environments

| Arquivo | Uso |
|---|---|
| `src/environments/environment.ts` | Desenvolvimento local |
| `src/environments/environment.prod.ts` | Produção |

Variáveis configuráveis:

```typescript
{
  apiUrl: 'http://localhost:8000/api/v1',       // URL do backend
  mobileAppUrl: 'https://m.akan.webmadria.com', // Redirect mobile
  pollingIntervalMs: 15000,                      // Refresh de conversas
}
```

### Device Detection

O CRM detecta automaticamente dispositivos mobile via User-Agent e redireciona para a URL configurada em `mobileAppUrl`. O usuário pode optar por permanecer no desktop (opt-out salvo em localStorage).

### Autenticação

- JWT Bearer Token via `AuthInterceptor`
- Controle de acesso por papel: **Admin**, **Manager**, **Sales Rep**
- Rotas protegidas por `authGuard` (login) e `roleGuard` (permissões)
- Redirect automático para `/auth/login` quando token expira (401)

## Roadmap

Consulte o plano completo em [`plan/akan-sales-crm-plano-desenvolvimento.md`](plan/akan-sales-crm-plano-desenvolvimento.md).

| Fase | Escopo | Status |
|---|---|---|
| 1 | Fundação (scaffold, auth, layout, device detection) | Concluído |
| 2 | Gestão de Leads (CRUD, BANT visual, timeline) | Pendente |
| 3 | Pipeline Kanban (drag-and-drop, estágios) | Pendente |
| 4 | Conversas da IA (chat viewer, intervenção manual) | Pendente |
| 5 | Dashboard e Atividades (KPIs, charts, CRUD) | Pendente |
| 6 | Relatórios, Settings e Polish (analytics, admin, testes) | Pendente |
