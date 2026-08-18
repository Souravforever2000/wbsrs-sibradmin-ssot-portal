import { Component, HostBinding, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarItem { label: string; icon: string; link: string; count?: number; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @HostBinding('class.collapsed-host') get collapsedHost(): boolean { return this.collapsed(); }
  readonly collapsed = signal(false);
  readonly dashboardOpen = signal(true);
  readonly dashboardItems: SidebarItem[] = [
    { label: 'Executive Overview', icon: 'dashboard', link: '/dashboard' },
    { label: 'Member Master Directory', icon: 'group', link: '/citizens', count: 50 },
    { label: 'Analytics & Trends', icon: 'analytics', link: '/analytics' },
    { label: 'District & Block', icon: 'map', link: '/geography' },
    { label: 'Scheme Performance', icon: 'account_balance', link: '/schemes', count: 31 },
    { label: 'Match Workbench', icon: 'hub', link: '/match-workbench', count: 154 },
    { label: 'Fuzzy Match Lab', icon: 'auto_awesome', link: '/fuzzy-match' },
    { label: 'Data Grade Audit', icon: 'fact_check', link: '/data-audit' },
    { label: 'Gap Analysis', icon: 'warning', link: '/gap-analysis' },
    { label: 'Reports', icon: 'description', link: '/reports' },
  ];
  readonly utilityItems: SidebarItem[] = [
    { label: 'Alerts & Exceptions', icon: 'notifications', link: '/alerts' },
    { label: 'Analytics Assistant', icon: 'smart_toy', link: '/assistant' },
    { label: 'Administration', icon: 'admin_panel_settings', link: '/administration' },
  ];

  toggle(): void { this.collapsed.update((value) => !value); }
  toggleDashboard(): void { if (this.collapsed()) this.collapsed.set(false); else this.dashboardOpen.update((value) => !value); }
}
