import { HttpResponse, delay, http } from 'msw';
import { BACKUP_LIST } from '../data/backups';
import type { Backup } from '../data/backups';

let backups: Backup[] = [...BACKUP_LIST];

export const backupHandlers = [
  http.get('/api/backups', async ({ request }) => {
    const url = new URL(request.url);
    const name = url.searchParams.get('name');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const sortField = url.searchParams.get('sortField');
    const sortOrder = url.searchParams.get('sortOrder');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);

    let filtered = [...backups];

    if (name) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(name.toLowerCase()),
      );
    }

    if (type) {
      filtered = filtered.filter((b) => b.type === type);
    }

    if (status) {
      filtered = filtered.filter((b) => b.status === status);
    }

    // 创建时间范围过滤
    const createTimeFrom = url.searchParams.get('createTimeFrom');
    const createTimeTo = url.searchParams.get('createTimeTo');
    if (createTimeFrom || createTimeTo) {
      const fromMs = createTimeFrom ? Date.parse(createTimeFrom) : NaN;
      const toMs = createTimeTo ? Date.parse(createTimeTo) : NaN;
      filtered = filtered.filter((b) => {
        const c = new Date(b.createTime).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    if (sortField) {
      const order = sortOrder === '-1' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortField as keyof Backup];
        const bVal = b[sortField as keyof Backup];
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

  http.post('/api/backups', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.name || !body.type) {
      return HttpResponse.json({ message: '名称和类型必填' }, { status: 400 });
    }

    const newBackup: Backup = {
      id: Date.now().toString(36),
      name: body.name as string,
      fileName: (body.fileName as string) ?? '',
      fileSize: Number(body.fileSize ?? 0),
      type: body.type as 'full' | 'incremental',
      status: (body.status as 'success' | 'failed' | 'running') ?? 'success',
      createTime: new Date().toISOString(),
      remark: (body.remark as string) ?? '',
    };

    backups.unshift(newBackup);
    return HttpResponse.json(newBackup, { status: 201 });
  }),

  http.delete('/api/backups/:id', async ({ params }) => {
    const { id } = params;
    const index = backups.findIndex((b) => b.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '备份记录不存在' }, { status: 404 });
    }

    backups.splice(index, 1);
    return HttpResponse.json({ message: '删除成功' });
  }),
];
