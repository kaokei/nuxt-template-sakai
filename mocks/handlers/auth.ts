import { HttpResponse, delay, http } from 'msw';
import { AUTH_USERS } from '../data/auth';
import type { AuthUser } from '../data/auth';

const sessions = new Map<string, AuthUser>();

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function extractToken(request: Request): string | null {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  return auth.slice(7);
}

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const { username, password } = body;

    if (!username || !password) {
      return HttpResponse.json(
        { message: '用户名和密码必填' },
        { status: 400 },
      );
    }

    const user = AUTH_USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) {
      return HttpResponse.json(
        { message: '用户名或密码错误' },
        { status: 401 },
      );
    }

    const token = generateToken();
    sessions.set(token, user);

    return HttpResponse.json({ token, user });
  }),

  http.get('/api/auth/user', async ({ request }) => {
    const token = extractToken(request);
    if (!token) {
      return HttpResponse.json({ message: '未登录' }, { status: 401 });
    }

    const user = sessions.get(token);
    if (!user) {
      return HttpResponse.json({ message: '会话已过期' }, { status: 401 });
    }

    return HttpResponse.json({ user });
  }),

  http.post('/api/auth/logout', async ({ request }) => {
    const token = extractToken(request);
    if (token) {
      sessions.delete(token);
    }
    return HttpResponse.json({ message: '已退出登录' });
  }),
];
