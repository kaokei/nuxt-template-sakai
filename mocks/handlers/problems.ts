import { HttpResponse, delay, http } from 'msw';
import { generateProblems } from '../data/problems';
import type { Problem } from '../data/problems';

let problems = generateProblems(60);

export const problemHandlers = [
  // 查询列表
  http.get('/api/problems', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    // 筛选
    let filtered = [...problems];
    const searchParams: Record<string, string> = {};
    url.searchParams.forEach((v, k) => {
      if (!['page', 'pageSize', 'sortField', 'sortOrder'].includes(k) && v) {
        searchParams[k] = v;
      }
    });

    for (const [key, value] of Object.entries(searchParams)) {
      filtered = filtered.filter((p) => {
        const val = (p as unknown as Record<string, unknown>)[key];
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

  // 查询单条
  http.get('/api/problems/:id', async ({ params }) => {
    const problem = problems.find((p) => p.id === params.id);
    await delay(200);
    if (!problem)
      return HttpResponse.json({ message: '题目不存在' }, { status: 404 });
    return HttpResponse.json(problem);
  }),

  // 新增
  http.post('/api/problems', async ({ request }) => {
    const body = (await request.json()) as Partial<Problem>;
    const now = new Date().toISOString();
    const created: Problem = {
      id: crypto.randomUUID(),
      problemNumber: `OJ-${Date.now()}`,
      title: body.title ?? '',
      owner: body.owner ?? '',
      difficulty: body.difficulty ?? 'Easy',
      tags: body.tags ?? [],
      acceptanceRate: body.acceptanceRate ?? 50,
      submissions: body.submissions ?? 0,
      timeLimit: body.timeLimit ?? 1000,
      memoryLimit: body.memoryLimit ?? 256,
      createTime: now,
      lastModifiedTime: now,
      accessLevel: body.accessLevel ?? 'Public',
      description: body.description ?? '',
    };
    problems.unshift(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新
  http.put('/api/problems/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Problem>;
    const idx = problems.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '题目不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    problems[idx] = {
      ...problems[idx]!,
      ...clean,
      id: params.id,
      lastModifiedTime: new Date().toISOString(),
    } as Problem;
    await delay(400);
    return HttpResponse.json(problems[idx]);
  }),

  // 删除单条
  http.delete('/api/problems/:id', async ({ params }) => {
    const idx = problems.findIndex((p) => p.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '题目不存在' }, { status: 404 });
    problems.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // 批量删除
  http.post('/api/problems/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = problems.length;
    problems = problems.filter((p) => !ids.includes(p.id));
    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: before - problems.length,
    });
  }),

  // 选项数据（标签/难度/可见级别/所有者）
  http.get('/api/problems/options', async () => {
    await delay(150);
    const tags = [...new Set(problems.flatMap((p) => p.tags))];
    const difficultyOptions = [
      { label: '简单', value: 'Easy' },
      { label: '中等', value: 'Medium' },
      { label: '困难', value: 'Hard' },
    ];
    const accessLevelOptions = [
      { label: '公开', value: 'Public' },
      { label: '私有', value: 'Private' },
      { label: '共享', value: 'Shared' },
    ];
    const ownerOptions = [...new Set(problems.map((p) => p.owner))].map(
      (name) => ({ label: name, value: name }),
    );

    return HttpResponse.json({
      tags,
      difficultyOptions,
      accessLevelOptions,
      ownerOptions,
    });
  }),
];
