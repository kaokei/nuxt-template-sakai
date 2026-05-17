import { HttpResponse, delay, http } from 'msw';
import { BACKUP_LIST } from '../data/backups';
import type { Backup } from '../data/backups';

let backups: Backup[] = [...BACKUP_LIST];

export const backupHandlers = [
  http.get('/api/backups', async () => {
    await delay(150);
    return HttpResponse.json({ data: backups, total: backups.length });
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
