import { HttpResponse, delay, http } from 'msw';
import { generateOnlineUsers } from '../data/online-users';
import type { OnlineUser } from '../data/online-users';

let onlineUsers = generateOnlineUsers(35);

export const onlineUserHandlers = [
  // 查询在线用户列表
  http.get('/api/online-users', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    let filtered = [...onlineUsers];
    const searchParams: Record<string, string> = {};
    url.searchParams.forEach((v, k) => {
      if (!['page', 'pageSize', 'sortField', 'sortOrder'].includes(k) && v) {
        searchParams[k] = v;
      }
    });

    for (const [key, value] of Object.entries(searchParams)) {
      filtered = filtered.filter((u) => {
        const val = (u as unknown as Record<string, unknown>)[key];
        if (typeof val === 'string')
          return val.toLowerCase().includes(value.toLowerCase());
        return String(val) === value;
      });
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const va = (a as unknown as Record<string, unknown>)[sortField];
        const vb = (b as unknown as Record<string, unknown>)[sortField];
        const sa = String(va ?? '');
        const sb = String(vb ?? '');
        return sa.localeCompare(sb, 'zh-CN') * sortOrder;
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    await delay(300);
    return HttpResponse.json({ data, total });
  }),

  // 单条强退
  http.delete('/api/online-users/:token', async ({ params }) => {
    const { token } = params as { token: string };
    const idx = onlineUsers.findIndex((u) => u.token === token);
    await delay(200);
    if (idx === -1) {
      return HttpResponse.json(
        { success: false, message: '用户不在线或已被强制下线' },
        { status: 404 },
      );
    }
    onlineUsers.splice(idx, 1);
    return HttpResponse.json({ success: true, message: '已强制下线' });
  }),

  // 批量强退
  http.delete('/api/online-users', async ({ request }) => {
    const body = (await request.json()) as { tokens: string[] };
    await delay(300);
    if (!body.tokens?.length) {
      return HttpResponse.json(
        { success: false, message: '未选择用户' },
        { status: 400 },
      );
    }
    const tokenSet = new Set(body.tokens);
    const before = onlineUsers.length;
    onlineUsers = onlineUsers.filter((u) => !tokenSet.has(u.token));
    const removed = before - onlineUsers.length;
    return HttpResponse.json({
      success: true,
      message: `已强制下线 ${removed} 个用户`,
    });
  }),
];
