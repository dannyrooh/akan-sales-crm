import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { ShellComponent } from './core/layout/shell/shell.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'leads',
        loadChildren: () => import('./features/leads/leads.routes').then(m => m.LEADS_ROUTES),
      },
      {
        path: 'pipeline',
        loadChildren: () => import('./features/pipeline/pipeline.routes').then(m => m.PIPELINE_ROUTES),
      },
      {
        path: 'conversations',
        loadChildren: () => import('./features/conversations/conversations.routes').then(m => m.CONVERSATIONS_ROUTES),
      },
      {
        path: 'activities',
        loadChildren: () => import('./features/activities/activities.routes').then(m => m.ACTIVITIES_ROUTES),
      },
      {
        path: 'reports',
        canActivate: [roleGuard(['admin', 'manager'])],
        loadChildren: () => import('./features/reports/reports.routes').then(m => m.REPORTS_ROUTES),
      },
      {
        path: 'settings',
        canActivate: [roleGuard(['admin'])],
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
