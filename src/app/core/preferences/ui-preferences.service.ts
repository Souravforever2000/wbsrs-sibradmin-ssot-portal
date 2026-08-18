import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type PortalLanguage = 'en' | 'bn' | 'hi';

@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly languageKey = 'wbssot.language';
  private readonly darkModeKey = 'wbssot.dark-mode';
  private readonly accessibilityKey = 'wbssot.high-contrast';

  readonly language = signal<PortalLanguage>(this.readLanguage());
  readonly darkMode = signal(this.readBoolean(this.darkModeKey));
  readonly highContrast = signal(this.readBoolean(this.accessibilityKey));

  constructor() {
    this.applyTheme(this.darkMode());
    this.applyAccessibility(this.highContrast());
  }

  setLanguage(language: PortalLanguage): void {
    this.language.set(language);
    this.write(this.languageKey, language);
  }

  toggleDarkMode(): void {
    const enabled = !this.darkMode();
    this.darkMode.set(enabled);
    this.write(this.darkModeKey, String(enabled));
    this.applyTheme(enabled);
  }

  toggleAccessibility(): void {
    const enabled = !this.highContrast();
    this.highContrast.set(enabled);
    this.write(this.accessibilityKey, String(enabled));
    this.applyAccessibility(enabled);
  }

  private applyTheme(enabled: boolean): void {
    this.document.documentElement.classList.toggle('dark-theme', enabled);
    this.document.documentElement.style.colorScheme = enabled ? 'dark' : 'light';
  }

  private applyAccessibility(enabled: boolean): void {
    this.document.documentElement.classList.toggle('high-contrast', enabled);
  }

  private readLanguage(): PortalLanguage {
    const value = this.read(this.languageKey);
    return value === 'bn' || value === 'hi' ? value : 'en';
  }

  private readBoolean(key: string): boolean {
    return this.read(key) === 'true';
  }

  private read(key: string): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try { return localStorage.getItem(key); } catch { return null; }
  }

  private write(key: string, value: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try { localStorage.setItem(key, value); } catch { /* storage is optional */ }
  }
}
