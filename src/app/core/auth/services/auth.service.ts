import { Injectable, signal } from '@angular/core';
import { CurrentUser } from '../../models/user.model';

const demoUser: CurrentUser = {
  id: 'officer-001',
  displayName: 'Ananya Sen',
  email: 'ananya.sen@wb.gov.in',
  role: 'STATE_ADMIN',
  department: 'Department of Information Technology & Electronics',
  permissions: ['dashboard.view', 'citizens.view', 'citizens.sensitive', 'reports.export', 'audit.view'],
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'wbssot.current-user';
  readonly currentUser = signal<CurrentUser>(this.readUser());

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  hasRole(roles: string[]): boolean {
    return roles.length === 0 || roles.includes(this.currentUser().role);
  }

  hasPermission(permission: string): boolean {
    return this.currentUser().permissions.includes(permission);
  }

  signOut(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set({ ...demoUser, role: 'VIEWER', permissions: ['dashboard.view'] });
  }

  private readUser(): CurrentUser {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? (JSON.parse(saved) as CurrentUser) : demoUser;
    } catch {
      return demoUser;
    }
  }
}
