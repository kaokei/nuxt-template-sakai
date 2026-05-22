import { HttpResponse, delay, http } from 'msw';
import { generateDataMonitor } from '../data/data-monitor';

let dataMonitor = generateDataMonitor();

export const dataMonitorHandlers = [
  http.get('/api/data-monitor', async () => {
    await delay(200);
    return HttpResponse.json(dataMonitor);
  }),

  http.get('/api/data-monitor/sql-list', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField') || 'avgTime';
    const sortOrder = Number(url.searchParams.get('sortOrder') || -1);

    let list = [...dataMonitor.sqlList];
    list.sort((a, b) => {
      const va = (a as unknown as Record<string, unknown>)[sortField] ?? '';
      const vb = (b as unknown as Record<string, unknown>)[sortField] ?? '';
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * sortOrder;
      }
      return String(va).localeCompare(String(vb), 'zh-CN') * sortOrder;
    });

    const total = list.length;
    const start = (page - 1) * pageSize;
    const data = list.slice(start, start + pageSize);

    await delay(200);
    return HttpResponse.json({ data, total });
  }),

  http.get('/api/data-monitor/uri-list', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField') || 'avgTime';
    const sortOrder = Number(url.searchParams.get('sortOrder') || -1);

    let list = [...dataMonitor.uriList];
    list.sort((a, b) => {
      const va = (a as unknown as Record<string, unknown>)[sortField] ?? '';
      const vb = (b as unknown as Record<string, unknown>)[sortField] ?? '';
      if (typeof va === 'number' && typeof vb === 'number') {
        return (va - vb) * sortOrder;
      }
      return String(va).localeCompare(String(vb), 'zh-CN') * sortOrder;
    });

    const total = list.length;
    const start = (page - 1) * pageSize;
    const data = list.slice(start, start + pageSize);

    await delay(200);
    return HttpResponse.json({ data, total });
  }),
];
