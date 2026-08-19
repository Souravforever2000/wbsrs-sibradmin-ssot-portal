import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/** A small, guarded storage boundary so feature code never talks to localStorage directly. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  get<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in privacy-constrained browser contexts.
    }
  }

  remove(key: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to recover when storage is unavailable.
    }
  }
}
