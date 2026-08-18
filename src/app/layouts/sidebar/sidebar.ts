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
    { label: 'Executive Overview', icon: '◔', link: '/dashboard' },
    { label: 'Member Master Directory', icon: '♟', link: '/citizens', count: 50 },
    { label: 'Analytics & Trends', icon: '⌁', link: '/analytics' },
    { label: 'District & Block', icon: '◫', link: '/geography' },
    { label: 'Scheme Performance', icon: '♧', link: '/schemes', count: 31 },
    { label: 'Match Workbench', icon: '♢', link: '/match-workbench', count: 154 },
    { label: 'Fuzzy Match Lab', icon: '✣', link: '/fuzzy-match' },
    { label: 'Data Grade Audit', icon: '▦', link: '/data-audit' },
    { label: 'Gap Analysis', icon: '△', link: '/gap-analysis' },
    { label: 'Reports', icon: '▤', link: '/reports' },
  ];
  readonly utilityItems: SidebarItem[] = [
    { label: 'Alerts & Exceptions', icon: '!', link: '/alerts' },
    { label: 'Analytics Assistant', icon: '✦', link: '/assistant' },
    { label: 'Administration', icon: '⚙', link: '/administration' },
  ];

  toggle(): void { this.collapsed.update((value) => !value); }
  toggleDashboard(): void { if (this.collapsed()) this.collapsed.set(false); else this.dashboardOpen.update((value) => !value); }
}
