import type { Announcement } from '@sakai/types/announcement';
import type { NotificationRecord } from '@sakai/types/notification';
import { HttpResponse, delay, http } from 'msw';
import { ANNOUNCEMENT_LIST } from '../data/announcements';
import { NOTIFICATION_RECORD_LIST } from '../data/notifications';

let announcements: Announcement[] = [...ANNOUNCEMENT_LIST];
let notificationRecords: NotificationRecord[] = [...NOTIFICATION_RECORD_LIST];

function generateId(): string {
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const announcementHandlers = [
  http.get('/api/announcements', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = url.searchParams.get('sortOrder');
    const status = url.searchParams.get('status');
    const keyword = url.searchParams.get('keyword');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    let filtered = [...announcements];

    if (status) {
      filtered = filtered.filter((a) => a.status === status);
    }

    if (keyword) {
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(keyword.toLowerCase()) ||
          (a.summary &&
            a.summary.toLowerCase().includes(keyword.toLowerCase())),
      );
    }

    if (dateFrom || dateTo) {
      const fromMs = dateFrom ? Date.parse(dateFrom) : NaN;
      const toMs = dateTo ? Date.parse(dateTo) : NaN;
      filtered = filtered.filter((a) => {
        const c = new Date(a.createdAt).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    if (sortField) {
      const order = sortOrder === '-1' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortField as keyof Announcement];
        const bVal = b[sortField as keyof Announcement];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return order * aVal.localeCompare(bVal, 'zh-CN');
        }
        if (aVal < bVal) return -1 * order;
        if (aVal > bVal) return 1 * order;
        return 0;
      });
    } else {
      // 默认：置顶优先，再按创建时间倒序
      filtered.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    await delay(200);
    return HttpResponse.json({ data: paged, total });
  }),

  http.get('/api/announcements/published', async ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    const published = announcements
      .filter((a) => a.status === 'published')
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    await delay(100);
    return HttpResponse.json({
      data: published.slice(0, limit),
      total: published.length,
    });
  }),

  http.get('/api/announcements/:id', async ({ params }) => {
    const { id } = params;
    const announcement = announcements.find((a) => a.id === id);

    if (!announcement) {
      return HttpResponse.json({ message: '公告不存在' }, { status: 404 });
    }

    // 增加阅读量
    if (announcement.status === 'published') {
      announcement.viewCount += 1;
    }

    await delay(100);
    return HttpResponse.json({ data: announcement });
  }),

  http.post('/api/announcements', async ({ request }) => {
    const body = (await request.json()) as Partial<Announcement>;

    if (!body.title || !body.content) {
      return HttpResponse.json(
        { message: '标题和内容不能为空' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const newAnnouncement: Announcement = {
      id: generateId(),
      title: body.title,
      content: body.content,
      summary: body.summary || '',
      coverImage: body.coverImage,
      status: body.status || 'draft',
      isPinned: body.isPinned || false,
      scheduledAt: body.scheduledAt,
      createdBy: 'admin',
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    // 如果直接发布
    if (newAnnouncement.status === 'published') {
      newAnnouncement.publishedAt = now;

      // 发布公告时自动生成通知记录
      const notifRecord: NotificationRecord = {
        id: `notif-${Date.now()}`,
        type: 'announcement',
        title: `新公告发布：${newAnnouncement.title}`,
        content: newAnnouncement.summary || newAnnouncement.title,
        sourceId: newAnnouncement.id,
        sourceType: 'announcement',
        targetType: 'all',
        targetDesc: '全体用户',
        targetIds: ['all'],
        sendStatus: 'sent',
        readCount: 0,
        totalCount: 150,
        createdAt: now,
        sentAt: now,
        senderId: 'admin',
        senderName: '系统管理员',
      };
      notificationRecords.unshift(notifRecord);
    }

    announcements.unshift(newAnnouncement);

    await delay(200);
    return HttpResponse.json({ data: newAnnouncement }, { status: 201 });
  }),

  http.put('/api/announcements/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Announcement>;
    const index = announcements.findIndex((a) => a.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '公告不存在' }, { status: 404 });
    }

    const existing = announcements[index]!;
    const now = new Date().toISOString();

    announcements[index] = {
      ...existing,
      ...body,
      id: existing.id,
      updatedAt: now,
    } as Announcement;

    // 如果从非发布状态变为已发布，自动生成通知记录
    if (body.status === 'published' && existing.status !== 'published') {
      announcements[index].publishedAt = now;

      const notifRecord: NotificationRecord = {
        id: `notif-${Date.now()}`,
        type: 'announcement',
        title: `新公告发布：${announcements[index].title}`,
        content: announcements[index].summary || announcements[index].title,
        sourceId: announcements[index].id,
        sourceType: 'announcement',
        targetType: 'all',
        targetDesc: '全体用户',
        targetIds: ['all'],
        sendStatus: 'sent',
        readCount: 0,
        totalCount: 150,
        createdAt: now,
        sentAt: now,
        senderId: 'admin',
        senderName: '系统管理员',
      };
      notificationRecords.unshift(notifRecord);
    }

    // 下架
    if (body.status === 'archived' && existing.status !== 'archived') {
      announcements[index]!.archivedAt = now;
    }

    await delay(200);
    return HttpResponse.json({ data: announcements[index]! });
  }),

  http.delete('/api/announcements/:id', async ({ params }) => {
    const { id } = params;
    const index = announcements.findIndex((a) => a.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '公告不存在' }, { status: 404 });
    }

    // 草稿和定时状态的公告可以删除
    const deletable = ['draft', 'scheduled'];
    if (!deletable.includes(announcements[index]!.status)) {
      return HttpResponse.json(
        { message: '只有草稿和定时状态的公告才能删除' },
        { status: 400 },
      );
    }

    announcements.splice(index, 1);

    await delay(200);
    return HttpResponse.json({ message: '删除成功' });
  }),

  // 发布公告
  http.post('/api/announcements/:id/publish', async ({ params }) => {
    const { id } = params;
    const index = announcements.findIndex((a) => a.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '公告不存在' }, { status: 404 });
    }

    const now = new Date().toISOString();
    announcements[index]!.status = 'published';
    announcements[index]!.publishedAt = now;
    announcements[index]!.updatedAt = now;

    // 发布时生成通知记录
    const notifRecord: NotificationRecord = {
      id: `notif-${Date.now()}`,
      type: 'announcement',
      title: `新公告发布：${announcements[index]!.title}`,
      content: announcements[index]!.summary || announcements[index]!.title,
      sourceId: announcements[index]!.id,
      sourceType: 'announcement',
      targetType: 'all',
      targetDesc: '全体用户',
      targetIds: ['all'],
      sendStatus: 'sent',
      readCount: 0,
      totalCount: 150,
      createdAt: now,
      sentAt: now,
      senderId: 'admin',
      senderName: '系统管理员',
    };
    notificationRecords.unshift(notifRecord);

    await delay(200);
    return HttpResponse.json({ data: announcements[index] });
  }),

  // 下架公告
  http.post('/api/announcements/:id/archive', async ({ params }) => {
    const { id } = params;
    const index = announcements.findIndex((a) => a.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '公告不存在' }, { status: 404 });
    }

    const now = new Date().toISOString();
    announcements[index]!.status = 'archived';
    announcements[index]!.archivedAt = now;
    announcements[index]!.updatedAt = now;

    await delay(200);
    return HttpResponse.json({ data: announcements[index] });
  }),
];
