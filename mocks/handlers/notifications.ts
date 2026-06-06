import type {
  NotificationFormData,
  NotificationRecord,
  UserNotification,
} from '@sakai/types/notification';
import { HttpResponse, delay, http } from 'msw';
import {
  NOTIFICATION_RECORD_LIST,
  USER_NOTIFICATION_LIST,
} from '../data/notifications';

let notificationRecords: NotificationRecord[] = [...NOTIFICATION_RECORD_LIST];
let userNotifications: UserNotification[] = [...USER_NOTIFICATION_LIST];

export const notificationHandlers = [
  // ========== 管理端：通知发送记录 ==========

  http.get('/api/notifications/records', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const sortField = url.searchParams.get('sortField');
    const sortOrder = url.searchParams.get('sortOrder');
    const type = url.searchParams.get('type');
    const sendStatus = url.searchParams.get('sendStatus');
    const keyword = url.searchParams.get('keyword');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');

    let filtered = [...notificationRecords];

    if (type) {
      filtered = filtered.filter((n) => n.type === type);
    }

    if (sendStatus) {
      filtered = filtered.filter((n) => n.sendStatus === sendStatus);
    }

    if (keyword) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(keyword.toLowerCase()) ||
          n.content.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    if (dateFrom || dateTo) {
      const fromMs = dateFrom ? Date.parse(dateFrom) : NaN;
      const toMs = dateTo ? Date.parse(dateTo) : NaN;
      filtered = filtered.filter((n) => {
        const c = new Date(n.createdAt).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    if (sortField) {
      const order = sortOrder === '-1' ? -1 : 1;
      filtered.sort((a, b) => {
        const aVal = a[sortField as keyof NotificationRecord];
        const bVal = b[sortField as keyof NotificationRecord];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return order * aVal.localeCompare(bVal, 'zh-CN');
        }
        return 0;
      });
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    await delay(150);
    return HttpResponse.json({ data: paged, total });
  }),

  // 创建并发送通知
  http.post('/api/notifications/records', async ({ request }) => {
    const body = (await request.json()) as NotificationFormData;

    const newRecord: NotificationRecord = {
      id: `notif-${Date.now()}`,
      type: body.type,
      title: body.title,
      content: body.content,
      targetType: body.targetType,
      targetDesc: body.targetDesc,
      targetIds: body.targetIds,
      sendStatus: 'sent',
      readCount: 0,
      totalCount: body.targetType === 'all' ? 150 : body.targetIds.length,
      createdAt: new Date().toISOString(),
      sentAt: new Date().toISOString(),
      senderId: 'admin',
      senderName: '系统管理员',
    };

    notificationRecords.unshift(newRecord);

    await delay(200);
    return HttpResponse.json({ data: newRecord }, { status: 201 });
  }),

  http.get('/api/notifications/records/:id', async ({ params }) => {
    const { id } = params;
    const record = notificationRecords.find((n) => n.id === id);

    if (!record) {
      return HttpResponse.json({ message: '通知记录不存在' }, { status: 404 });
    }

    await delay(100);
    return HttpResponse.json({ data: record });
  }),

  // 重新发送失败的通知
  http.post('/api/notifications/records/:id/retry', async ({ params }) => {
    const { id } = params;
    const index = notificationRecords.findIndex((n) => n.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '通知记录不存在' }, { status: 404 });
    }

    if (notificationRecords[index]!.sendStatus !== 'failed') {
      return HttpResponse.json(
        { message: '只有发送失败的通知才能重试' },
        { status: 400 },
      );
    }

    notificationRecords[index]!.sendStatus = 'sent';
    notificationRecords[index]!.sentAt = new Date().toISOString();

    await delay(200);
    return HttpResponse.json({ data: notificationRecords[index]! });
  }),

  // ========== 用户端：我的通知 ==========

  http.get('/api/notifications', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const isRead = url.searchParams.get('isRead');

    // 当前登录用户假设为 admin
    const currentUserId = 'admin';
    let filtered = userNotifications.filter((n) => n.userId === currentUserId);

    if (isRead !== null && isRead !== undefined) {
      filtered = filtered.filter((n) => n.isRead === (isRead === 'true'));
    }

    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    await delay(100);
    return HttpResponse.json({ data: paged, total });
  }),

  // 最近通知（顶栏铃铛用）
  http.get('/api/notifications/recent', async () => {
    const currentUserId = 'admin';
    const recent = userNotifications
      .filter((n) => n.userId === currentUserId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);

    await delay(50);
    return HttpResponse.json({ data: recent });
  }),

  // 未读通知数
  http.get('/api/notifications/unread-count', async () => {
    const currentUserId = 'admin';
    const unreadCount = userNotifications.filter(
      (n) => n.userId === currentUserId && !n.isRead,
    ).length;

    await delay(50);
    return HttpResponse.json({
      data: {
        total: unreadCount,
        byType: {
          announcement: userNotifications.filter(
            (n) =>
              n.userId === currentUserId &&
              !n.isRead &&
              n.type === 'announcement',
          ).length,
          system: userNotifications.filter(
            (n) =>
              n.userId === currentUserId && !n.isRead && n.type === 'system',
          ).length,
          business: userNotifications.filter(
            (n) =>
              n.userId === currentUserId && !n.isRead && n.type === 'business',
          ).length,
        },
      },
    });
  }),

  // 标记已读
  http.patch('/api/notifications/:id/read', async ({ params }) => {
    const { id } = params;
    const index = userNotifications.findIndex((n) => n.id === id);

    if (index === -1) {
      return HttpResponse.json({ message: '通知不存在' }, { status: 404 });
    }

    userNotifications[index]!.isRead = true;
    userNotifications[index]!.readAt = new Date().toISOString();

    await delay(50);
    return HttpResponse.json({ data: userNotifications[index]! });
  }),

  // 全部标记已读
  http.patch('/api/notifications/read-all', async () => {
    const currentUserId = 'admin';
    const now = new Date().toISOString();

    userNotifications.forEach((n) => {
      if (n.userId === currentUserId && !n.isRead) {
        n.isRead = true;
        n.readAt = now;
      }
    });

    const count = userNotifications.filter(
      (n) => n.userId === currentUserId && n.isRead,
    ).length;

    await delay(100);
    return HttpResponse.json({ message: '已全部标记为已读', count });
  }),
];
