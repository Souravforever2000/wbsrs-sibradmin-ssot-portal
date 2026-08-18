import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly router = inject(Router);
  readonly url = signal('/');
  readonly title = computed(() => this.getTitle(this.url()));

  constructor() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => this.url.set(event.urlAfterRedirects));
  }

  private getTitle(url: string): string {
    if (url.includes('citizens')) return url.includes('/citizens/') ? 'Citizen 360' : 'Member Master Directory';
    if (url.includes('analytics')) return url.includes('growth') ? 'Growth Analysis' : url.includes('trends') ? 'Trend Analysis' : 'Analytics Overview';
    if (url.includes('geography')) return 'District & Block Analytics';
    if (url.includes('schemes')) return 'Scheme Performance';
    if (url.includes('match-workbench')) return 'Scheme Match Workbench';
    if (url.includes('fuzzy-match')) return 'Fuzzy Match Lab & Engine';
    if (url.includes('data-audit')) return 'Data Grade Audit';
    if (url.includes('gap-analysis')) return 'Welfare Gap / Lack Analysis';
    if (url.includes('reports')) return 'Reports & Exports';
    if (url.includes('alerts')) return 'Alerts & Exceptions';
    if (url.includes('administration')) return 'Administration & Audit';
    if (url.includes('assistant')) return 'Analytics Assistant';
    return 'Executive Overview';
  }
}
