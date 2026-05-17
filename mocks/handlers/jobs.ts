import { HttpResponse, delay, http } from 'msw';
import { JOB_LIST } from '../data/jobs';
import type { Job } from '../data/jobs';

let jobs: Job[] = [...JOB_LIST];

export const jobsHandlers = [
  http.get('/api/jobs', async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const group = url.searchParams.get('group');
    const status = url.searchParams.get('status');
    const sortField = url.searchParams.get('sortField');
    const sortOrder = url.searchParams.get('sortOrder');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    let filtered = [...jobs];

    if (name) {
      filtered = filtered.filter((j) =>
        j.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    if (group) {
      filtered = filtered.filter((j) =>
        j.group.toLowerCase().includes(group.toLowerCase()),
      );
    }

    if (status) {
      filtered = filtered.filter((j) => j.status === status);
    }

    if (sortField) {
      const order = sortOrder === '-1' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortField as keyof Job];
        const bVal = b[sortField as keyof Job];
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

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    await delay(150);
    return HttpResponse.json({ data: paged, total });
  }),

  http.put('/api/jobs/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const index = jobs.findIndex((j) => j.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    const existing = jobs[index]!;
    const updated: Job = {
      id: existing.id,
      name: (body.name as string) ?? existing.name,
      group: (body.group as string) ?? existing.group,
      cron: (body.cron as string) ?? existing.cron,
      className: (body.className as string) ?? existing.className,
      methodName: (body.methodName as string) ?? existing.methodName,
      params: (body.params as string) ?? existing.params,
      status: (body.status as 'running' | 'paused') ?? existing.status,
      lastRunTime: existing.lastRunTime,
      nextRunTime: (body.nextRunTime as string) ?? existing.nextRunTime,
      createTime: existing.createTime,
      remark: (body.remark as string) ?? existing.remark,
    };
    jobs[index] = updated;

    return HttpResponse.json(updated);
  }),

  http.post('/api/jobs/:id/execute', async ({ params }) => {
    const { id } = params;
    const index = jobs.findIndex((j) => j.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    const existing = jobs[index]!;
    const updated: Job = { ...existing, lastRunTime: new Date().toISOString() };
    jobs[index] = updated;

    return HttpResponse.json({
      message: '执行成功',
      lastRunTime: updated.lastRunTime,
    });
  }),

  http.post('/api/jobs/:id/pause', async ({ params }) => {
    const { id } = params;
    const index = jobs.findIndex((j) => j.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    const existing = jobs[index]!;
    const updated: Job = { ...existing, status: 'paused' };
    jobs[index] = updated;

    return HttpResponse.json({ message: '已暂停', job: updated });
  }),

  http.post('/api/jobs/:id/resume', async ({ params }) => {
    const { id } = params;
    const index = jobs.findIndex((j) => j.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '任务不存在' }, { status: 404 });
    }

    const existing = jobs[index]!;
    const updated: Job = { ...existing, status: 'running' };
    jobs[index] = updated;

    return HttpResponse.json({ message: '已恢复', job: updated });
  }),
];
