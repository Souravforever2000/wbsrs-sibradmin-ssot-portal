import { Routes } from '@angular/router';

import { LoginPage } from './core/auth/components/login/login';
import { DashboardOverviewPage } from './features/dashboard/pages/dashboard-overview/dashboard-overview';
import { OperationalWorkspacePage } from './shared/components/operational-workspace/operational-workspace';
import { MatchWorkbenchPage } from './features/match-workbench/pages/match-workbench/match-workbench';
import { FuzzyMatchLabPage } from './features/fuzzy-match/pages/fuzzy-match-lab/fuzzy-match-lab';
import { DataGradeAuditPage } from './features/data-grade-audit/pages/data-grade-audit/data-grade-audit';
import { CitizenListPage } from './features/citizens/pages/citizen-list/citizen-list';
import { Citizen360Page } from './features/citizens/pages/citizen-360/citizen-360';
import { GapAnalysisPage } from './features/gap-analysis/pages/gap-analysis/gap-analysis';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'dashboard', component: DashboardOverviewPage },
  { path: 'analytics', data: { workspace: 'analytics' }, component: OperationalWorkspacePage },
  { path: 'analytics/growth', data: { workspace: 'growth' }, component: OperationalWorkspacePage },
  { path: 'analytics/trends', data: { workspace: 'trends' }, component: OperationalWorkspacePage },
  { path: 'geography', data: { workspace: 'geography' }, component: OperationalWorkspacePage },
  { path: 'schemes', data: { workspace: 'schemes' }, component: OperationalWorkspacePage },
  { path: 'schemes/compare', data: { workspace: 'schemes' }, component: OperationalWorkspacePage },
  { path: 'match-workbench', component: MatchWorkbenchPage },
  { path: 'fuzzy-match', component: FuzzyMatchLabPage },
  { path: 'data-audit', component: DataGradeAuditPage },
  { path: 'citizens', component: CitizenListPage },
  { path: 'directory', redirectTo: 'citizens', pathMatch: 'full' },
  { path: 'citizens/:uid', component: Citizen360Page },
  { path: 'gap-analysis', component: GapAnalysisPage },
  { path: 'reports', data: { workspace: 'reports' }, component: OperationalWorkspacePage },
  { path: 'alerts', data: { workspace: 'alerts' }, component: OperationalWorkspacePage },
  { path: 'administration', data: { roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DEPARTMENT_ADMIN'], workspace: 'administration' }, component: OperationalWorkspacePage },
  { path: 'administration/audit', data: { roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DEPARTMENT_ADMIN'], workspace: 'administration' }, component: OperationalWorkspacePage },
  { path: 'assistant', data: { workspace: 'assistant' }, component: OperationalWorkspacePage },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: '/' },
];