import { HttpResponse, delay, http } from 'msw';
import { ROLE_LIST } from '../data/roles';
import type { Role } from '../data/roles';

let roles: Role[] = JSON.parse(JSON.stringify(ROLE_LIST)) as Role[];

export const roleHandlers = [
  // 查询角色列表（分页 + 筛选 + 排序）
  http.get('/api/roles', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    let filtered = [...roles];

    // 检索条件
    const name = url.searchParams.get('name');
    const code = url.searchParams.get('code');
    const status = url.searchParams.get('status');

    if (name) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    if (code) {
      filtered = filtered.filter((r) =>
        r.code.toLowerCase().includes(code.toLowerCase()),
      );
    }
    if (status) {
      filtered = filtered.filter((r) => r.status === status);
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

  // 角色选项（⚠️ 必须在 /:id 之前，避免 options 被当作 id 匹配）
  http.get('/api/roles/options', async () => {
    const roleOptions = roles.map((r) => ({
      label: r.name,
      value: r.id,
    }));

    await delay(150);
    return HttpResponse.json({ data: { roleOptions } });
  }),

  // 查询单条角色
  http.get('/api/roles/:id', async ({ params }) => {
    const role = roles.find((r) => r.id === params.id);
    await delay(200);
    if (!role)
      return HttpResponse.json({ message: '角色不存在' }, { status: 404 });
    return HttpResponse.json(role);
  }),

  // 新增角色
  http.post('/api/roles', async ({ request }) => {
    const body = (await request.json()) as Partial<Role>;
    const now = new Date().toISOString();
    const created: Role = {
      id: crypto.randomUUID(),
      name: body.name ?? '',
      code: body.code ?? '',
      order: body.order ?? 0,
      dataScope: body.dataScope ?? 'self',
      menuIds: body.menuIds ?? [],
      deptIds: body.deptIds ?? [],
      status: body.status ?? 'active',
      createTime: now,
      remark: body.remark ?? '',
    };
    roles.unshift(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新角色
  http.put('/api/roles/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Role>;
    const idx = roles.findIndex((r) => r.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '角色不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    roles[idx] = {
      ...roles[idx]!,
      ...clean,
      id: params.id as string,
    } as Role;
    await delay(400);
    return HttpResponse.json(roles[idx]);
  }),

  // 删除单条角色
  http.delete('/api/roles/:id', async ({ params }) => {
    const idx = roles.findIndex((r) => r.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '角色不存在' }, { status: 404 });
    roles.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // 批量删除角色
  http.post('/api/roles/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = roles.length;
    roles = roles.filter((r) => !ids.includes(r.id));
    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: before - roles.length,
    });
  }),
];
