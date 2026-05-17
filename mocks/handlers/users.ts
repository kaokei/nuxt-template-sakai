import { HttpResponse, delay, http } from 'msw';
import { ALL_USERS, DEPT_LIST, ROLE_LIST } from '../data/users';
import type { User } from '../data/users';

let users = [...ALL_USERS];

export const userHandlers = [
  // 查询列表
  http.get('/api/users', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    // 筛选
    let filtered = [...users];
    const searchParams: Record<string, string> = {};
    url.searchParams.forEach((v, k) => {
      if (!['page', 'pageSize', 'sortField', 'sortOrder'].includes(k) && v) {
        searchParams[k] = v;
      }
    });

    // 时间范围筛选（单独处理，走 createTime 字段）
    const dateFrom = searchParams.createTimeFrom;
    const dateTo = searchParams.createTimeTo;
    delete searchParams.createTimeFrom;
    delete searchParams.createTimeTo;
    if (dateFrom || dateTo) {
      const fromMs = dateFrom ? Date.parse(dateFrom) : NaN;
      const toMs = dateTo ? Date.parse(dateTo) : NaN;
      filtered = filtered.filter((u) => {
        const c = new Date(u.createTime).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    for (const [key, value] of Object.entries(searchParams)) {
      filtered = filtered.filter((u) => {
        const val = (u as unknown as Record<string, unknown>)[key];
        if (Array.isArray(val)) return val.includes(value);
        if (typeof val === 'string')
          return val.toLowerCase().includes(value.toLowerCase());
        return String(val) === value;
      });
    }

    // 排序
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

  // 选项数据（部门/角色/性别/状态）
  // ⚠️ 必须在 /api/users/:id 之前，避免 options 被当作 id 匹配
  http.get('/api/users/options', async () => {
    const deptOptions = DEPT_LIST.map((d) => ({ label: d.name, value: d.id }));
    const roleOptions = ROLE_LIST.map((r) => ({ label: r.name, value: r.id }));
    const genderOptions = [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' },
    ];
    const statusOptions = [
      { label: '启用', value: 'active' },
      { label: '禁用', value: 'inactive' },
    ];

    await delay(150);
    return HttpResponse.json({
      deptOptions,
      roleOptions,
      genderOptions,
      statusOptions,
    });
  }),

  // 模糊搜索用户（用于部门负责人等选择场景，最多返回10条）
  // ⚠️ 必须在 /api/users/:id 之前，避免 search 被当作 id 匹配
  http.get('/api/users/search', async ({ request }) => {
    const url = new URL(request.url);
    const keyword = (url.searchParams.get('keyword') || '').toLowerCase();

    let filtered = users.filter((u) => u.status === 'active');
    if (keyword) {
      filtered = filtered.filter(
        (u) =>
          u.nickName.toLowerCase().includes(keyword) ||
          u.userName.toLowerCase().includes(keyword),
      );
    }

    const result = filtered.slice(0, 10).map((u) => ({
      label: `${u.nickName}（${u.deptName}）`,
      value: u.id,
    }));

    await delay(200);
    return HttpResponse.json(result);
  }),

  // 查询单条
  http.get('/api/users/:id', async ({ params }) => {
    const user = users.find((u) => u.id === params.id);
    await delay(200);
    if (!user)
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    return HttpResponse.json(user);
  }),

  // 新增
  http.post('/api/users', async ({ request }) => {
    const body = (await request.json()) as Partial<User> & {
      password?: string;
    };
    const now = new Date().toISOString();
    const created: User = {
      id: crypto.randomUUID(),
      userName: body.userName ?? '',
      nickName: body.nickName ?? '',
      phone: body.phone ?? '',
      email: body.email ?? '',
      gender: body.gender ?? 'other',
      avatar:
        body.avatar ?? `https://i.pravatar.cc/150?u=${body.userName ?? 'user'}`,
      deptId: body.deptId ?? '',
      deptName: body.deptName ?? '',
      roleIds: body.roleIds ?? [],
      roleNames: body.roleNames ?? [],
      status: body.status ?? 'active',
      createTime: now,
      remark: body.remark ?? '',
    };
    users.unshift(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新
  http.put('/api/users/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<User>;
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    users[idx] = {
      ...users[idx]!,
      ...clean,
      id: params.id as string,
    } as User;
    await delay(400);
    return HttpResponse.json(users[idx]);
  }),

  // 删除单条
  http.delete('/api/users/:id', async ({ params }) => {
    const idx = users.findIndex((u) => u.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '用户不存在' }, { status: 404 });
    users.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // 批量删除
  http.post('/api/users/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = users.length;
    users = users.filter((u) => !ids.includes(u.id));
    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: before - users.length,
    });
  }),
];
