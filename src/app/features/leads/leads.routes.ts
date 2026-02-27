import { Routes } from '@angular/router';
import { LeadListComponent } from './lead-list/lead-list.component';
import { LeadDetailComponent } from './lead-detail/lead-detail.component';

export const LEADS_ROUTES: Routes = [
  { path: '', component: LeadListComponent },
  { path: ':id', component: LeadDetailComponent },
];
