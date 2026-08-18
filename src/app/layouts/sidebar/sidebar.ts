import { Component, HostBinding, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiPreferencesService } from '../../core/preferences/ui-preferences.service';

interface SidebarItem { label: string; icon: string; link: string; count?: number; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private readonly preferences = inject(UiPreferencesService);
  @HostBinding('class.collapsed-host') get collapsedHost(): boolean { return this.collapsed(); }
  readonly collapsed = signal(false);
  readonly dashboardOpen = signal(true);

  get workspaceLabel(): string {
    return this.preferences.language() === 'bn' ? '\u0993\u09af\u09bc\u09be\u09b0\u09cd\u0995\u09b8\u09cd\u09aa\u09c7\u09b8' : this.preferences.language() === 'hi' ? '\u0935\u0930\u094d\u0915\u0938\u094d\u092a\u0947\u0938' : 'WORKSPACE';
  }

  get dashboardLabel(): string {
    return this.preferences.language() === 'bn' ? '\u09a1\u09cd\u09af\u09be\u09b6\u09ac\u09cb\u09b0\u09cd\u09a1' : this.preferences.language() === 'hi' ? '\u0921\u0948\u0936\u092c\u09cb\u09b0\u09cd\u09a1' : 'Dashboard';
  }

  get operationsLabel(): string {
    return this.preferences.language() === 'bn' ? '\u0985\u09aa\u09be\u09b0\u09c7\u09b6\u09a8\u09b8' : this.preferences.language() === 'hi' ? '\u0911\u092a\u0930\u0947\u0936\u0902\u0938' : 'OPERATIONS';
  }

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
