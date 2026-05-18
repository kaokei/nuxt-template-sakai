import { HttpResponse, delay, http } from 'msw';
import { DICT_DATA_LIST, DICT_TYPE_LIST } from '../data/dict';
import type { DictData, DictType } from '../data/dict';

let types: DictType[] = JSON.parse(
  JSON.stringify(DICT_TYPE_LIST),
) as DictType[];
let datas: DictData[] = JSON.parse(
  JSON.stringify(DICT_DATA_LIST),
) as DictData[];

export const dictHandlers = [
  // ==================== 字典类型 CRUD ====================

  // 查询字典类型列表（分页 + 筛选 + 排序）
  http.get('/api/dict/types', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    let filtered = [...types];

    const name = url.searchParams.get('name');
    const code = url.searchParams.get('code');
    const status = url.searchParams.get('status');

    if (name) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    if (code) {
      filtered = filtered.filter((t) =>
        t.code.toLowerCase().includes(code.toLowerCase()),
      );
    }
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    const createTimeFrom = url.searchParams.get('createTimeFrom');
    const createTimeTo = url.searchParams.get('createTimeTo');
    if (createTimeFrom || createTimeTo) {
      const fromMs = createTimeFrom ? Date.parse(createTimeFrom) : NaN;
      const toMs = createTimeTo ? Date.parse(createTimeTo) : NaN;
      filtered = filtered.filter((t) => {
        const c = new Date(t.createTime).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
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

  // 查询单个字典类型
  http.get('/api/dict/types/:id', async ({ params }) => {
    const type = types.find((t) => t.id === params.id);
    await delay(200);
    if (!type) {
      return HttpResponse.json({ message: '字典类型不存在' }, { status: 404 });
    }
    return HttpResponse.json(type);
  }),

  // 新增字典类型
  http.post('/api/dict/types', async ({ request }) => {
    const body = (await request.json()) as Partial<DictType>;
    const now = new Date().toISOString();
    const created: DictType = {
      id: crypto.randomUUID(),
      name: body.name ?? '',
      code: body.code ?? '',
      status: body.status ?? 'active',
      remark: body.remark ?? '',
      createTime: now,
    };
    types.unshift(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新字典类型
  http.put('/api/dict/types/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<DictType>;
    const idx = types.findIndex((t) => t.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '字典类型不存在' }, { status: 404 });
    }

    const oldCode = types[idx]!.code;
    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    types[idx] = {
      ...types[idx]!,
      ...clean,
      id: params.id as string,
    } as DictType;

    // 如果编码变更，同步更新关联的字典数据的 typeCode
    const newCode = clean.code as string | undefined;
    if (newCode && newCode !== oldCode) {
      datas = datas.map((d) =>
        d.typeCode === oldCode ? { ...d, typeCode: newCode } : d,
      );
    }

    await delay(400);
    return HttpResponse.json(types[idx]);
  }),

  // 删除单个字典类型（级联删除其下所有字典数据）
  http.delete('/api/dict/types/:id', async ({ params }) => {
    const type = types.find((t) => t.id === params.id);
    if (!type) {
      return HttpResponse.json({ message: '字典类型不存在' }, { status: 404 });
    }
    const deletedDataCount = datas.filter(
      (d) => d.typeCode === type.code,
    ).length;
    types = types.filter((t) => t.id !== params.id);
    datas = datas.filter((d) => d.typeCode !== type.code);
    await delay(300);
    return HttpResponse.json({
      success: true,
      deletedDataCount,
      typeName: type.name,
    });
  }),

  // 批量删除字典类型（级联删除数据）
  http.post('/api/dict/types/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const toDelete = types.filter((t) => ids.includes(t.id));
    const codesToDelete = toDelete.map((t) => t.code);
    const beforeTypes = types.length;
    const beforeDatas = datas.length;
    types = types.filter((t) => !ids.includes(t.id));
    datas = datas.filter((d) => !codesToDelete.includes(d.typeCode));
    await delay(400);
    return HttpResponse.json({
      success: true,
      deletedTypes: beforeTypes - types.length,
      deletedDatas: beforeDatas - datas.length,
    });
  }),

  // ==================== 字典数据 CRUD ====================

  // 查询字典数据列表（按 typeCode 筛选 + 分页）
  http.get('/api/dict/data', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 50);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    let filtered = [...datas];

    const typeCode = url.searchParams.get('typeCode');
    const label = url.searchParams.get('label');
    const value = url.searchParams.get('value');
    const status = url.searchParams.get('status');

    if (typeCode) {
      filtered = filtered.filter((d) => d.typeCode === typeCode);
    }
    if (label) {
      filtered = filtered.filter((d) =>
        d.label.toLowerCase().includes(label.toLowerCase()),
      );
    }
    if (value) {
      filtered = filtered.filter((d) =>
        d.value.toLowerCase().includes(value.toLowerCase()),
      );
    }
    if (status) {
      filtered = filtered.filter((d) => d.status === status);
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const va = (a as unknown as Record<string, unknown>)[sortField];
        const vb = (b as unknown as Record<string, unknown>)[sortField];
        if (typeof va === 'number' && typeof vb === 'number') {
          return (va - vb) * sortOrder;
        }
        return (
          String(va ?? '').localeCompare(String(vb ?? ''), 'zh-CN') * sortOrder
        );
      });
    } else {
      filtered.sort((a, b) => a.order - b.order);
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    await delay(200);
    return HttpResponse.json({ data, total });
  }),

  // 查询单个字典数据
  http.get('/api/dict/data/:id', async ({ params }) => {
    const data = datas.find((d) => d.id === params.id);
    await delay(150);
    if (!data) {
      return HttpResponse.json({ message: '字典数据不存在' }, { status: 404 });
    }
    return HttpResponse.json(data);
  }),

  // 新增字典数据
  http.post('/api/dict/data', async ({ request }) => {
    const body = (await request.json()) as Partial<DictData>;
    const now = new Date().toISOString();
    const created: DictData = {
      id: crypto.randomUUID(),
      typeCode: body.typeCode ?? '',
      label: body.label ?? '',
      value: body.value ?? '',
      valueType: body.valueType ?? 'string',
      extValue: body.extValue ?? '',
      order: body.order ?? 0,
      cssClass: body.cssClass ?? '',
      listClass: body.listClass ?? '',
      isDefault: body.isDefault ?? false,
      status: body.status ?? 'active',
      remark: body.remark ?? '',
      createTime: now,
    };
    datas.push(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新字典数据
  http.put('/api/dict/data/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<DictData>;
    const idx = datas.findIndex((d) => d.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '字典数据不存在' }, { status: 404 });
    }

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    datas[idx] = {
      ...datas[idx]!,
      ...clean,
      id: params.id as string,
    } as DictData;
    await delay(400);
    return HttpResponse.json(datas[idx]);
  }),

  // 删除单个字典数据
  http.delete('/api/dict/data/:id', async ({ params }) => {
    const idx = datas.findIndex((d) => d.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '字典数据不存在' }, { status: 404 });
    }
    datas.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // 批量删除字典数据
  http.post('/api/dict/data/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = datas.length;
    datas = datas.filter((d) => !ids.includes(d.id));
    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: before - datas.length,
    });
  }),
];
