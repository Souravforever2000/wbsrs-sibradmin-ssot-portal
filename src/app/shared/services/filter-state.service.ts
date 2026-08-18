import { Injectable, signal } from '@angular/core';
import { DashboardFilter, defaultDashboardFilter } from '../models/filter.model';

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  readonly filters = signal<DashboardFilter>({ ...defaultDashboardFilter });

  update(patch: Partial<DashboardFilter>): void {
    this.filters.update((current) => ({ ...current, ...patch }));
  }

  reset(): void {
    this.filters.set({ ...defaultDashboardFilter });
  }
}
