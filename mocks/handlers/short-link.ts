import { HttpResponse, delay, http } from 'msw';
import { nanoid } from 'nanoid';
import type { ShortLink } from '../data/short-link';
import { SHORT_LINK_LIST } from '../data/short-link';

let links: ShortLink[] = JSON.parse(
  JSON.stringify(SHORT_LINK_LIST),
) as ShortLink[];

function isExpired(link: ShortLink): boolean {
  if (!link.expireAt) return false;
  return new Date(link.expireAt).getTime() < Date.now();
}

export const shortLinkHandlers = [
  // 查询短链列表（关键词搜索 + 活动标签筛选）
  http.get('/api/short-links', async ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');
    const campaign = url.searchParams.get('campaign');

    let filtered = [...links];

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(kw) ||
          l.shortCode.toLowerCase().includes(kw) ||
          l.originalUrl.toLowerCase().includes(kw),
      );
    }

    if (campaign) {
      filtered = filtered.filter((l) => l.campaign === campaign);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    await delay(300);
    return HttpResponse.json(filtered);
  }),

  // 获取所有活动标签（去重）
  http.get('/api/short-links/campaigns', async () => {
    const campaigns = new Set<string>();
    for (const link of links) {
      if (link.campaign) campaigns.add(link.campaign);
    }
    await delay(200);
    return HttpResponse.json(Array.from(campaigns).sort());
  }),

  // 查询单条短链
  http.get('/api/short-links/:id', async ({ params }) => {
    const link = links.find((l) => l.id === params.id);
    await delay(200);
    if (!link) {
      return HttpResponse.json({ message: '短链不存在' }, { status: 404 });
    }
    return HttpResponse.json(link);
  }),

  // 创建短链
  http.post('/api/short-links', async ({ request }) => {
    const body = (await request.json()) as Omit<
      ShortLink,
      'id' | 'createdAt' | 'updatedAt'
    >;
    const now = new Date().toISOString();
    const newLink: ShortLink = {
      id: nanoid(12),
      ...body,
      createdAt: now,
      updatedAt: now,
    };
    links.unshift(newLink);
    await delay(300);
    return HttpResponse.json(newLink, { status: 201 });
  }),

  // 更新短链
  http.put('/api/short-links/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<
      Omit<ShortLink, 'id' | 'createdAt'>
    >;
    const idx = links.findIndex((l) => l.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '短链不存在' }, { status: 404 });
    }
    const link = links[idx]!;
    Object.assign(link, body, {
      updatedAt: new Date().toISOString(),
    });
    await delay(300);
    return HttpResponse.json(link);
  }),

  // 删除单条短链
  http.delete('/api/short-links/:id', async ({ params }) => {
    const idx = links.findIndex((l) => l.id === params.id);
    if (idx === -1) {
      return HttpResponse.json({ message: '短链不存在' }, { status: 404 });
    }
    links.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),

  // 批量删除
  http.post('/api/short-links/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = links.length;
    links = links.filter((l) => !ids.includes(l.id));
    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: before - links.length,
    });
  }),

  // 批量编辑
  http.post('/api/short-links/batch-update', async ({ request }) => {
    const { ids, data } = (await request.json()) as {
      ids: string[];
      data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>;
    };
    const now = new Date().toISOString();
    let count = 0;
    for (const link of links) {
      if (ids.includes(link.id)) {
        Object.assign(link, data, { updatedAt: now });
        count++;
      }
    }
    await delay(400);
    return HttpResponse.json({ success: true, updated: count });
  }),

  // 批量创建
  http.post('/api/short-links/batch-create', async ({ request }) => {
    const { list } = (await request.json()) as {
      list: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[];
    };
    const now = new Date().toISOString();
    const created: ShortLink[] = list.map((item) => ({
      id: nanoid(12),
      ...item,
      createdAt: now,
      updatedAt: now,
    }));
    links.unshift(...created);
    await delay(500);
    return HttpResponse.json(created, { status: 201 });
  }),
];
