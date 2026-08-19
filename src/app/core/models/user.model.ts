export type UserRole =
  | 'SUPER_ADMIN'
  | 'STATE_ADMIN'
  | 'DEPARTMENT_ADMIN'
  | 'DISTRICT_OFFICER'
  | 'BLOCK_OFFICER'
  | 'ANALYST'
  | 'VIEWER';

export interface CurrentUser {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  department?: string;
  districtId?: string;
  blockId?: string;
  permissions: string[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
  user: CurrentUser;
}
