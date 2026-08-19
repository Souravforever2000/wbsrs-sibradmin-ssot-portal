import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'success' | 'error' | 'info';

export interface PortalNotification {
  id: number;
  kind: NotificationKind;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly notifications = signal<PortalNotification[]>([]);
  private nextId = 0;

  success(message: string): void { this.show('success', message); }
  error(message: string): void { this.show('error', message); }
  info(message: string): void { this.show('info', message); }

  dismiss(id: number): void {
    this.notifications.update((items) => items.filter((item) => item.id !== id));
  }

  private show(kind: NotificationKind, message: string): void {
    const item: PortalNotification = { id: ++this.nextId, kind, message };
    this.notifications.update((items) => [...items, item]);
    window.setTimeout(() => this.dismiss(item.id), 5000);
  }
}
