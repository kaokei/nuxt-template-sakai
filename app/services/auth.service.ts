import type { AuthUser, LoginResponse } from '~/types/auth';

@Injectable()
export class AuthService {
  async login(username: string, password: string): Promise<AuthUser> {
    const { token, user } = await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
    });

    try {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }

    return user;
  }

  async logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: this._authHeaders(),
      });
    } catch {
      // ignore
    }

    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch {
      // ignore
    }
  }

  async getCurrentUser(): Promise<AuthUser> {
    const token = this.getToken();
    if (!token) {
      throw new Error('未登录');
    }

    const { user } = await $fetch<{ user: AuthUser }>('/api/auth/user', {
      headers: { Authorization: `Bearer ${token}` },
    });

    return user;
  }

  isAuthenticated(): boolean {
    try {
      return !!localStorage.getItem('auth_token');
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('auth_token');
    } catch {
      return null;
    }
  }

  getPermissions(): string[] {
    try {
      const raw = localStorage.getItem('auth_user');
      if (!raw) return [];
      const user: AuthUser = JSON.parse(raw);
      return user.permissions ?? [];
    } catch {
      return [];
    }
  }

  private _authHeaders(): Record<string, string> {
    const token = this.getToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }
}
