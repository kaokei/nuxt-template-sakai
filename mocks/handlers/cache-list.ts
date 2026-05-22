import { HttpResponse, delay, http } from 'msw';
import { generateCacheItems } from '../data/cache-list';

interface CacheItem {
  cacheName: string;
  keyCount: number;
  ttl: string;
  size: string;
  type: string;
  remark: string;
  createTime: string;
}

function getSortValue(item: CacheItem, field: string): string | number {
  const value = (item as unknown as Record<string, string | number>)[field];
  return value ?? '';
}

let cacheItems: CacheItem[] = generateCacheItems(50);

export const cacheListHandlers = [
  http.get('/api/cache-list', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = Number(url.searchParams.get('sortOrder') || -1);
    const cacheName = url.searchParams.get('cacheName');
    const type = url.searchParams.get('type');

    let filtered = [...cacheItems];

    if (cacheName) {
      filtered = filtered.filter((item) =>
        item.cacheName.toLowerCase().includes(cacheName.toLowerCase()),
      );
    }

    if (type) {
      filtered = filtered.filter((item) => item.type === type);
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const va = getSortValue(a, sortField);
        const vb = getSortValue(b, sortField);
        if (typeof va === 'number' && typeof vb === 'number') {
          return (va - vb) * sortOrder;
        }
        return String(va).localeCompare(String(vb), 'zh-CN') * sortOrder;
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    await delay(300);
    return HttpResponse.json({ data, total });
  }),

  http.get('/api/cache-list/:cacheName', async ({ params }) => {
    const { cacheName } = params as { cacheName: string };
    await delay(200);
    const item = cacheItems.find((c) => c.cacheName === cacheName);
    if (!item) {
      return HttpResponse.json({ message: '缓存不存在' }, { status: 404 });
    }
    return HttpResponse.json(item);
  }),

  http.delete('/api/cache-list/:cacheName', async ({ params }) => {
    const { cacheName } = params as { cacheName: string };
    await delay(300);
    const idx = cacheItems.findIndex((c) => c.cacheName === cacheName);
    if (idx === -1) {
      return HttpResponse.json(
        { success: false, message: '缓存不存在' },
        { status: 404 },
      );
    }
    cacheItems.splice(idx, 1);
    return HttpResponse.json({
      success: true,
      message: `缓存 ${cacheName} 已清除`,
    });
  }),

  http.delete('/api/cache-list', async ({ request }) => {
    const body = (await request.json()) as { cacheNames: string[] };
    await delay(400);
    if (!body.cacheNames?.length) {
      return HttpResponse.json(
        { success: false, message: '未选择缓存' },
        { status: 400 },
      );
    }
    const nameSet = new Set(body.cacheNames);
    cacheItems = cacheItems.filter((c) => !nameSet.has(c.cacheName));
    return HttpResponse.json({
      success: true,
      message: `已清除 ${body.cacheNames.length} 个缓存`,
    });
  }),
];
