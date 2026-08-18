import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './layouts/header/header';
import { Sidebar } from './layouts/sidebar/sidebar';
import { Navbar } from './layouts/navbar/navbar';
import { Footer } from './layouts/footer/footer';
import { UiPreferencesService } from './core/preferences/ui-preferences.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Sidebar, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly preferences = inject(UiPreferencesService);
  readonly routeUrl = signal('/');
  readonly isPublicRoute = computed(() => this.routeUrl() === '/login');

  constructor() {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => this.routeUrl.set(event.urlAfterRedirects));
  }
}
