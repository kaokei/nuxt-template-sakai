import { HttpResponse, delay, http } from 'msw';
import { generateOperLogs } from '../data/oper-logs';
import type { OperLog } from '../data/oper-logs';

let logs = generateOperLogs(100);

export const operLogHandlers = [
  // 查询列表
  http.get('/api/oper-logs', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);

    // 筛选
    let filtered = [...logs];
    const searchParams: Record<string, string> = {};
    url.searchParams.forEach((v, k) => {
      if (!['page', 'pageSize', 'sortField', 'sortOrder'].includes(k) && v) {
        searchParams[k] = v;
      }
    });

    // 时间范围筛选
    const dateFrom = searchParams.operationTimeFrom;
    const dateTo = searchParams.operationTimeTo;
    delete searchParams.operationTimeFrom;
    delete searchParams.operationTimeTo;
    if (dateFrom || dateTo) {
      const fromMs = dateFrom ? Date.parse(dateFrom) : NaN;
      const toMs = dateTo ? Date.parse(dateTo) : NaN;
      filtered = filtered.filter((l) => {
        const c = new Date(l.operationTime).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    for (const [key, value] of Object.entries(searchParams)) {
      filtered = filtered.filter((l) => {
        const val = (l as unknown as Record<string, unknown>)[key];
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

  // 选项数据（操作类型、模块、状态选项供搜索下拉使用）
  // ⚠️ 必须在 /api/oper-logs/:id 之前，避免 options 被当作 id 匹配
  http.get('/api/oper-logs/options', async () => {
    const modules = [...new Set(logs.map((l) => l.module))].sort();
    const types = [...new Set(logs.map((l) => l.operationType))].sort();
    await delay(100);
    return HttpResponse.json({
      moduleOptions: modules.map((m) => ({ label: m, value: m })),
      operationTypeOptions: types.map((t) => ({ label: t, value: t })),
      statusOptions: [
        { label: '成功', value: 'success' },
        { label: '失败', value: 'fail' },
      ],
    });
  }),

  // 查询单条详情
  http.get('/api/oper-logs/:id', async ({ params }) => {
    const { id } = params;
    const log = logs.find((l) => l.id === id);
    if (!log) {
      return HttpResponse.json({ message: '记录不存在' }, { status: 404 });
    }
    await delay(200);
    return HttpResponse.json(log);
  }),
];
