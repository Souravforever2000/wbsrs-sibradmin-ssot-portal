import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./core/auth/components/login/login').then((m) => m.LoginPage) },
  { path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./features/dashboard/pages/dashboard-overview/dashboard-overview').then((m) => m.DashboardOverviewPage) },
  { path: 'analytics', canActivate: [authGuard], data: { workspace: 'analytics' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'analytics/growth', canActivate: [authGuard], data: { workspace: 'growth' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'analytics/trends', canActivate: [authGuard], data: { workspace: 'trends' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'geography', canActivate: [authGuard], data: { workspace: 'geography' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'schemes', canActivate: [authGuard], data: { workspace: 'schemes' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'schemes/compare', canActivate: [authGuard], data: { workspace: 'schemes' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'match-workbench', canActivate: [authGuard], data: { workspace: 'workbench' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'fuzzy-match', canActivate: [authGuard], data: { workspace: 'fuzzy' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'data-audit', canActivate: [authGuard], data: { workspace: 'audit' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'citizens', canActivate: [authGuard], loadComponent: () => import('./features/citizens/pages/citizen-list/citizen-list').then((m) => m.CitizenListPage) },
  { path: 'directory', redirectTo: 'citizens', pathMatch: 'full' },
  { path: 'citizens/:uid', canActivate: [authGuard], loadComponent: () => import('./features/citizens/pages/citizen-360/citizen-360').then((m) => m.Citizen360Page) },
  { path: 'gap-analysis', canActivate: [authGuard], data: { workspace: 'gaps' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'reports', canActivate: [authGuard], data: { workspace: 'reports' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'alerts', canActivate: [authGuard], data: { workspace: 'alerts' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'administration', canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DEPARTMENT_ADMIN'], workspace: 'administration' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'administration/audit', canActivate: [authGuard, roleGuard], data: { roles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DEPARTMENT_ADMIN'], workspace: 'administration' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: 'assistant', canActivate: [authGuard], data: { workspace: 'assistant' }, loadComponent: () => import('./shared/components/operational-workspace/operational-workspace').then((m) => m.OperationalWorkspacePage) },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: '/' },
];
