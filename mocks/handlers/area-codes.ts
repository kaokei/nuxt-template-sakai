import { HttpResponse, delay, http } from 'msw';
import { AREA_CODE_LIST } from '../data/area-codes';
import type { AreaCode } from '../data/area-codes';

let areaCodes: AreaCode[] = JSON.parse(
  JSON.stringify(AREA_CODE_LIST),
) as AreaCode[];
let nextId = 37;

export const areaCodeHandlers = [
  // ==================== 查询区号列表（筛选 + 排序，返回全部数据） ====================
  http.get('/api/area-codes', async ({ request }) => {
    const url = new URL(request.url);
    const sortField = url.searchParams.get('sortField') || 'sort';
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    let filtered = [...areaCodes];

    const regionName = url.searchParams.get('regionName');
    const code = url.searchParams.get('code');
    const continent = url.searchParams.get('continent');
    const enabled = url.searchParams.get('enabled');

    if (regionName) {
      filtered = filtered.filter((item) =>
        item.regionName.includes(regionName),
      );
    }
    if (code) {
      filtered = filtered.filter((item) => item.code.includes(code));
    }
    if (continent) {
      filtered = filtered.filter((item) => item.continent === continent);
    }
    if (enabled !== null && enabled !== undefined) {
      const enabledBool = enabled === 'true';
      filtered = filtered.filter((item) => item.enabled === enabledBool);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField as keyof AreaCode];
      const bVal = b[sortField as keyof AreaCode];
      if (aVal == null || bVal == null) return 0;
      if (typeof aVal === 'string') {
        return sortOrder === 1
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortOrder === 1
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    const enabledCount = filtered.filter((item) => item.enabled).length;

    await delay(200);
    return HttpResponse.json({
      data: filtered,
      total: filtered.length,
      enabledCount,
    });
  }),

  // ==================== 新增区号 ====================
  http.post('/api/area-codes', async ({ request }) => {
    const body = (await request.json()) as Omit<AreaCode, 'id'>;
    const created: AreaCode = {
      id: String(nextId++),
      code: body.code ?? '',
      regionName: body.regionName ?? '',
      countryCode: body.countryCode ?? '',
      englishName: body.englishName ?? '',
      continent: body.continent ?? '亚洲',
      validationRule: body.validationRule ?? '',
      enabled: body.enabled ?? true,
      sort: body.sort ?? 0,
      remark: body.remark ?? '',
    };
    areaCodes.push(created);
    await delay(300);
    return HttpResponse.json(created, { status: 201 });
  }),

  // ==================== 更新区号 ====================
  http.put('/api/area-codes/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<AreaCode>;
    const idx = areaCodes.findIndex((item) => item.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '区号不存在' }, { status: 404 });
    }

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    areaCodes[idx] = {
      ...areaCodes[idx]!,
      ...clean,
      id: params.id as string,
    } as AreaCode;

    await delay(300);
    return HttpResponse.json(areaCodes[idx]);
  }),

  // ==================== 删除区号 ====================
  http.delete('/api/area-codes/:id', async ({ params }) => {
    const idx = areaCodes.findIndex((item) => item.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '区号不存在' }, { status: 404 });
    }
    areaCodes.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // ==================== 批量更新区号 ====================
  http.post('/api/area-codes/batch-update', async ({ request }) => {
    const { ids, data } = (await request.json()) as {
      ids: string[];
      data: Partial<AreaCode>;
    };
    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    for (const id of ids) {
      const idx = areaCodes.findIndex((item) => item.id === id);
      if (idx !== -1) {
        areaCodes[idx] = { ...areaCodes[idx]!, ...clean } as AreaCode;
      }
    }
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // ==================== 批量删除区号 ====================
  http.post('/api/area-codes/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = areaCodes.length;
    areaCodes = areaCodes.filter((item) => !ids.includes(item.id));
    await delay(300);
    return HttpResponse.json({
      success: true,
      deleted: before - areaCodes.length,
    });
  }),

  // ==================== 唯一性校验 ====================
  http.get('/api/area-codes/check-exists', async ({ request }) => {
    const url = new URL(request.url);
    const field = url.searchParams.get('field') as keyof AreaCode;
    const value = url.searchParams.get('value');
    const excludeId = url.searchParams.get('excludeId');

    if (!field || value === null) {
      return HttpResponse.json(
        { message: '缺少必要参数 field 或 value' },
        { status: 400 },
      );
    }

    const exists = areaCodes.some(
      (item) => item[field] === value && item.id !== (excludeId || undefined),
    );

    await delay(150);
    return HttpResponse.json({ exists });
  }),
];
