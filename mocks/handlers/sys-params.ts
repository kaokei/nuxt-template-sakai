import { HttpResponse, delay, http } from 'msw';
import { SYS_PARAM_LIST } from '../data/sys-params';
import type { SysParam } from '../data/sys-params';

let sysParams: SysParam[] = [...SYS_PARAM_LIST];

export const sysParamHandlers = [
  http.get('/api/sys-params', async () => {
    await delay(150);
    return HttpResponse.json({ data: sysParams, total: sysParams.length });
  }),

  http.post('/api/sys-params', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    if (!body.key || !body.value) {
      return HttpResponse.json(
        { message: '参数键和参数值必填' },
        { status: 400 },
      );
    }

    const newParam: SysParam = {
      id: Date.now().toString(36),
      name: (body.name as string) ?? '',
      key: body.key as string,
      value: body.value as string,
      type: (body.type as 'string' | 'number' | 'boolean') ?? 'string',
      group: (body.group as string) ?? '',
      sort: Number(body.sort ?? 0),
      remark: (body.remark as string) ?? '',
      status: (body.status as 'active' | 'inactive') ?? 'active',
      createTime: new Date().toISOString(),
    };

    sysParams.unshift(newParam);
    return HttpResponse.json(newParam, { status: 201 });
  }),

  http.put('/api/sys-params/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const index = sysParams.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '参数不存在' }, { status: 404 });
    }

    const existing = sysParams[index]!;
    const updated: SysParam = {
      id: existing.id,
      name: (body.name as string) ?? existing.name,
      key: (body.key as string) ?? existing.key,
      value: (body.value as string) ?? existing.value,
      type: (body.type as 'string' | 'number' | 'boolean') ?? existing.type,
      group: (body.group as string) ?? existing.group,
      sort: Number(body.sort ?? existing.sort),
      remark: (body.remark as string) ?? existing.remark,
      status: (body.status as 'active' | 'inactive') ?? existing.status,
      createTime: existing.createTime,
    };
    sysParams[index] = updated;

    return HttpResponse.json(updated);
  }),

  http.delete('/api/sys-params/:id', async ({ params }) => {
    const { id } = params;
    const index = sysParams.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '参数不存在' }, { status: 404 });
    }

    sysParams.splice(index, 1);
    return HttpResponse.json({ message: '删除成功' });
  }),
];
