import { HttpResponse, delay, http } from 'msw';
import { POST_LIST } from '../data/posts';
import type { Post } from '../data/posts';

let posts: Post[] = [...POST_LIST];

export const postsHandlers = [
  http.get('/api/posts', async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const code = url.searchParams.get('code');
    const status = url.searchParams.get('status');
    const sortField = url.searchParams.get('sortField');
    const sortOrder = url.searchParams.get('sortOrder');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    let filtered = [...posts];

    // 按名称过滤
    if (name) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    // 按编码过滤
    if (code) {
      filtered = filtered.filter((p) =>
        p.code.toLowerCase().includes(code.toLowerCase()),
      );
    }

    // 按状态过滤
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    // 创建时间范围筛选
    const createTimeFrom = url.searchParams.get('createTimeFrom');
    const createTimeTo = url.searchParams.get('createTimeTo');
    if (createTimeFrom || createTimeTo) {
      const fromMs = createTimeFrom ? Date.parse(createTimeFrom) : NaN;
      const toMs = createTimeTo ? Date.parse(createTimeTo) : NaN;
      filtered = filtered.filter((p) => {
        const c = new Date(p.createTime).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    // 排序
    if (sortField) {
      const order = sortOrder === '-1' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortField as keyof Post];
        const bVal = b[sortField as keyof Post];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return order * aVal.localeCompare(bVal, 'zh-CN');
        }
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    }

    const total = filtered.length;

    // 分页
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    await delay(200);
    return HttpResponse.json({ data: paged, total });
  }),

  http.post('/api/posts', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.name) {
      return HttpResponse.json({ message: '岗位名称必填' }, { status: 400 });
    }

    const newPost: Post = {
      id: Date.now().toString(36),
      name: body.name as string,
      code: (body.code as string) ?? '',
      sort: Number(body.sort ?? 0),
      status: (body.status as 'active' | 'inactive') ?? 'active',
      createTime: new Date().toISOString(),
      remark: (body.remark as string) ?? '',
    };

    posts.unshift(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),

  http.put('/api/posts/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '岗位不存在' }, { status: 404 });
    }

    const existing = posts[index]!;
    const updated: Post = {
      id: existing.id,
      name: (body.name as string) ?? existing.name,
      code: (body.code as string) ?? existing.code,
      sort: Number(body.sort ?? existing.sort),
      status: (body.status as 'active' | 'inactive') ?? existing.status,
      createTime: existing.createTime,
      remark: (body.remark as string) ?? existing.remark,
    };
    posts[index] = updated;

    return HttpResponse.json(updated);
  }),

  http.delete('/api/posts/:id', async ({ params }) => {
    const { id } = params;
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '岗位不存在' }, { status: 404 });
    }

    posts.splice(index, 1);
    return HttpResponse.json({ message: '删除成功' });
  }),
];
