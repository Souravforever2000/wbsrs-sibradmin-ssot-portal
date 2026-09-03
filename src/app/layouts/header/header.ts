// import { Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { interval } from 'rxjs';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { PortalLanguage, UiPreferencesService } from '../../core/preferences/ui-preferences.service';

// type HeaderCopy = {
//   refresh: string;
//   refreshing: string;
//   dbSchema: string;
//   masterDb: string;
//   notifications: string;
//   help: string;
//   accessibility: string;
//   darkMode: string;
//   lightMode: string;
//   session: string;
//   language: string;
//   environment: string;
// };

// const copy: Record<PortalLanguage, HeaderCopy> = {
//   en: { refresh: 'Regenerate Engine Data', refreshing: 'Refreshing...', dbSchema: 'DB Schema', masterDb: 'Master & Cross-Match DB', notifications: 'Notifications', help: 'Help centre', accessibility: 'Accessibility', darkMode: 'Dark mode', lightMode: 'Light mode', session: 'Session', language: 'Language', environment: 'DEMO DATA' },
//   bn: { refresh: 'ইঞ্জিন ডেটা পুনরায় তৈরি', refreshing: 'রিফ্রেশ হচ্ছে...', dbSchema: 'ডিবি স্কিমা', masterDb: 'মাস্টার ও ক্রস-ম্যাচ ডেটাবেস', notifications: 'বিজ্ঞপ্তি', help: 'সহায়তা কেন্দ্র', accessibility: 'অ্যাক্সেসিবিলিটি', darkMode: 'ডার্ক মোড', lightMode: 'লাইট মোড', session: 'সেশন', language: 'ভাষা', environment: 'ডেমো ডেটা' },
//   hi: { refresh: 'इंजन डेटा पुनः बनाएँ', refreshing: 'रिफ्रेश हो रहा है...', dbSchema: 'डीबी स्कीमा', masterDb: 'मास्टर और क्रॉस-मैच डेटाबेस', notifications: 'सूचनाएँ', help: 'सहायता केंद्र', accessibility: 'एक्सेसिबिलिटी', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', session: 'सेशन', language: 'भाषा', environment: 'डेमो डेटा' },
// };

// @Component({
//   selector: 'app-header',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './header.html',
//   styleUrl: './header.css',
// })
// export class Header {
//   private readonly preferences = inject(UiPreferencesService);
//   private readonly destroyRef = inject(DestroyRef);
//   private readonly sessionExpiry = this.readSessionExpiry();

//   readonly regenerate = output<void>();
//   readonly regenerating = signal(false);
//   readonly now = signal(new Date());
//   readonly labels = computed(() => copy[this.preferences.language()]);
//   readonly darkMode = this.preferences.darkMode;
//   readonly highContrast = this.preferences.highContrast;
//   readonly language = this.preferences.language;
//   readonly dateLabel = computed(() => this.now().toLocaleDateString(this.locale(), { day: '2-digit', month: 'short', year: 'numeric' }));
//   readonly timeLabel = computed(() => this.now().toLocaleTimeString(this.locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
//   readonly sessionLabel = computed(() => {
//     const remaining = Math.max(0, Math.floor((this.sessionExpiry - this.now().getTime()) / 1000));
//     return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
//   });

//   constructor() {
//     interval(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.now.set(new Date()));
//   }

//   regenerateEngineData(): void {
//     if (this.regenerating()) return;
//     this.regenerating.set(true);
//     this.regenerate.emit();
//     window.setTimeout(() => this.regenerating.set(false), 900);
//   }

//   changeLanguage(value: string): void {
//     if (value === 'en' || value === 'bn' || value === 'hi') this.preferences.setLanguage(value);
//   }

//   toggleDarkMode(): void { this.preferences.toggleDarkMode(); }
//   toggleAccessibility(): void { this.preferences.toggleAccessibility(); }

//   private locale(): string {
//     return this.language() === 'bn' ? 'bn-IN' : this.language() === 'hi' ? 'hi-IN' : 'en-IN';
//   }

//   private readSessionExpiry(): number {
//     const key = 'wbssot.session-expires';
//     try {
//       const saved = Number(localStorage.getItem(key));
//       if (Number.isFinite(saved) && saved > Date.now()) return saved;
//       const expiry = Date.now() + 30 * 60 * 1000;
//       localStorage.setItem(key, String(expiry));
//       return expiry;
//     } catch {
//       return Date.now() + 30 * 60 * 1000;
//     }
//   }
// }

import { Component, computed, DestroyRef, ElementRef, HostListener, inject, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PortalLanguage, UiPreferencesService } from '../../core/preferences/ui-preferences.service';

type HeaderCopy = {
  refresh: string;
  refreshing: string;
  dbSchema: string;
  masterDb: string;
  notifications: string;
  help: string;
  accessibility: string;
  darkMode: string;
  lightMode: string;
  session: string;
  language: string;
  environment: string;
  profile: string;
  accountSettings: string;
  signOut: string;
};

const copy: Record<PortalLanguage, HeaderCopy> = {
  en: { refresh: 'Regenerate Engine Data', refreshing: 'Refreshing...', dbSchema: 'DB Schema', masterDb: 'Master & Cross-Match DB', notifications: 'Notifications', help: 'Help centre', accessibility: 'Accessibility', darkMode: 'Dark mode', lightMode: 'Light mode', session: 'Session', language: 'Language', environment: 'DEMO DATA', profile: 'Signed in user', accountSettings: 'Account settings', signOut: 'Sign out' },
  bn: { refresh: 'ইঞ্জিন ডেটা পুনরায় তৈরি', refreshing: 'রিফ্রেশ হচ্ছে...', dbSchema: 'ডিবি স্কিমা', masterDb: 'মাস্টার ও ক্রস-ম্যাচ ডেটাবেস', notifications: 'বিজ্ঞপ্তি', help: 'সহায়তা কেন্দ্র', accessibility: 'অ্যাক্সেসিবিলিটি', darkMode: 'ডার্ক মোড', lightMode: 'লাইট মোড', session: 'সেশন', language: 'ভাষা', environment: 'ডেমো ডেটা', profile: 'সাইন ইন করা ব্যবহারকারী', accountSettings: 'অ্যাকাউন্ট সেটিংস', signOut: 'সাইন আউট' },
  hi: { refresh: 'इंजन डेटा पुनः बनाएँ', refreshing: 'रिफ्रेश हो रहा है...', dbSchema: 'डीबी स्कीमा', masterDb: 'मास्टर और क्रॉस-मैच डेटाबेस', notifications: 'सूचनाएँ', help: 'सहायता केंद्र', accessibility: 'एक्सेसिबिलिटी', darkMode: 'डार्क मोड', lightMode: 'लाइट मोड', session: 'सेशन', language: 'भाषा', environment: 'डेमो डेटा', profile: 'साइन इन उपयोगकर्ता', accountSettings: 'खाता सेटिंग्स', signOut: 'साइन आउट' },
};

export type UserProfile = {
  initials: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastLogin: string;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly preferences = inject(UiPreferencesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elRef = inject(ElementRef);
  private readonly sessionExpiry = this.readSessionExpiry();

  readonly regenerate = output<void>();
  readonly regenerating = signal(false);
  readonly now = signal(new Date());
  readonly labels = computed(() => copy[this.preferences.language()]);
  readonly darkMode = this.preferences.darkMode;
  readonly highContrast = this.preferences.highContrast;
  readonly language = this.preferences.language;
  readonly dateLabel = computed(() => this.now().toLocaleDateString(this.locale(), { day: '2-digit', month: 'short', year: 'numeric' }));
  readonly timeLabel = computed(() => this.now().toLocaleTimeString(this.locale(), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
  readonly sessionLabel = computed(() => {
    const remaining = Math.max(0, Math.floor((this.sessionExpiry - this.now().getTime()) / 1000));
    return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;
  });

  readonly showProfile = signal(false);
  readonly profile = signal<UserProfile>({
    initials: 'AS',
    name: 'Alex Sharma',
    email: 'alex.sharma@example.com',
    role: 'Admin',
    department: 'Data & Analytics',
    lastLogin: 'Today, 09:12',
  });

  constructor() {
    interval(1000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.now.set(new Date()));
  }

  regenerateEngineData(): void {
    if (this.regenerating()) return;
    this.regenerating.set(true);
    this.regenerate.emit();
    window.setTimeout(() => this.regenerating.set(false), 900);
  }

  changeLanguage(value: string): void {
    if (value === 'en' || value === 'bn' || value === 'hi') this.preferences.setLanguage(value);
  }

  toggleDarkMode(): void { this.preferences.toggleDarkMode(); }
  toggleAccessibility(): void { this.preferences.toggleAccessibility(); }

  toggleProfile(): void {
    this.showProfile.update((open) => !open);
  }

  closeProfile(): void {
    this.showProfile.set(false);
  }

  signOut(): void {
    this.closeProfile();
    try {
      localStorage.removeItem('wbssot.session-expires');
    } catch {
      // ignore storage errors
    }
    // Hook this up to your actual auth/session service, e.g.:
    // this.authService.signOut();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showProfile() && !this.elRef.nativeElement.contains(event.target)) {
      this.closeProfile();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeProfile();
  }

  private locale(): string {
    return this.language() === 'bn' ? 'bn-IN' : this.language() === 'hi' ? 'hi-IN' : 'en-IN';
  }

  private readSessionExpiry(): number {
    const key = 'wbssot.session-expires';
    try {
      const saved = Number(localStorage.getItem(key));
      if (Number.isFinite(saved) && saved > Date.now()) return saved;
      const expiry = Date.now() + 30 * 60 * 1000;
      localStorage.setItem(key, String(expiry));
      return expiry;
    } catch {
      return Date.now() + 30 * 60 * 1000;
    }
  }
}
