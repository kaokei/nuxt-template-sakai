import type { UserNotification } from '~/types/notification';

@Injectable()
export class UserNotificationService {
  unreadCount = 0;
  recentNotifications: UserNotification[] = [];
  loading = false;

  async fetchUnreadCount(): Promise<void> {
    try {
      const result = await $fetch<{ data: { total: number } }>(
        '/api/notifications/unread-count',
      );
      this.unreadCount = result.data.total;
    } catch {
      this.unreadCount = 0;
    }
  }

  async fetchRecent(): Promise<void> {
    this.loading = true;
    try {
      const result = await $fetch<{ data: UserNotification[] }>(
        '/api/notifications/recent',
      );
      this.recentNotifications = result.data;
    } catch {
      this.recentNotifications = [];
    } finally {
      this.loading = false;
    }
  }

  async markAsRead(id: string): Promise<void> {
    await $fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    const notif = this.recentNotifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      notif.readAt = new Date().toISOString();
    }
    this.unreadCount = Math.max(0, this.unreadCount - 1);
  }

  async markAllAsRead(): Promise<void> {
    await $fetch('/api/notifications/read-all', { method: 'PATCH' });
    this.recentNotifications.forEach((n) => {
      n.isRead = true;
      n.readAt = new Date().toISOString();
    });
    this.unreadCount = 0;
  }

  handleNotificationClick(notif: UserNotification): string {
    if (notif.sourceType === 'announcement' && notif.sourceId) {
      return `/demo/notices/${notif.sourceId}`;
    }
    return '';
  }
}
