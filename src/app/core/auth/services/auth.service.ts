import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../api/api.service';
import { AuthSession, CurrentUser, LoginRequest } from '../../models/user.model';
import { StorageService } from '../../services/storage.service';

const SESSION_KEY = 'wbssot.auth-session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);
  private readonly sessionState = signal<AuthSession | null>(this.storage.get<AuthSession>(SESSION_KEY));

  readonly session = this.sessionState.asReadonly();
  readonly currentUser = computed(() => this.sessionState()?.user ?? null);
  readonly accessToken = computed(() => this.sessionState()?.accessToken ?? null);

  isAuthenticated(): boolean {
    return this.accessToken() !== null;
  }

  hasRole(roles: string[]): boolean {
    const role = this.currentUser()?.role;
    return roles.length === 0 || (!!role && roles.includes(role));
  }

  hasPermission(permission: string): boolean {
    return this.currentUser()?.permissions.includes(permission) ?? false;
  }

  login(credentials: LoginRequest): Observable<AuthSession> {
    const request = { username: credentials.username.trim(), password: credentials.password };
    const result = environment.useMockApi
      ? of(this.createMockSession(request.username)).pipe(delay(450))
      : this.api.post<AuthSession>('/auth/login', request);
    return result.pipe(tap((session) => this.persistSession(session)));
  }

  signOut(): void {
    this.clearSession();
  }

  clearSession(): void {
    this.storage.remove(SESSION_KEY);
    this.sessionState.set(null);
  }

  private persistSession(session: AuthSession): void {
    this.storage.set(SESSION_KEY, session);
    this.sessionState.set(session);
  }

  /** Development-only identity. Production authentication always comes from POST /auth/login. */
  private createMockSession(username: string): AuthSession {
    const displayName = username
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, (character) => character.toUpperCase()) || 'Portal Officer';
    const user: CurrentUser = {
      id: `demo-${username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 24) || 'officer'}`,
      displayName,
      email: username.includes('@') ? username : `${username}@wb.gov.in`,
      role: 'STATE_ADMIN',
      department: 'SIBR Administration',
      permissions: ['dashboard.view', 'master-data.view', 'matching.review', 'data-quality.view', 'reports.export'],
    };
    return {
      // This is an ephemeral development session identifier, never a production credential.
      accessToken: `mock-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      user,
    };
  }
}
