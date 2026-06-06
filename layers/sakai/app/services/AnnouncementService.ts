import type {
  Announcement,
  AnnouncementFormData,
} from '@sakai/types/announcement';

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface AnnouncementQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
  status?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class AnnouncementService {
  async queryAnnouncements(
    params: AnnouncementQueryParams = {},
  ): Promise<PageResult<Announcement>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/announcements', { query });
  }

  async getAnnouncement(id: string): Promise<{ data: Announcement }> {
    return $fetch(`/api/announcements/${id}`);
  }

  async createAnnouncement(
    data: AnnouncementFormData & { status: string },
  ): Promise<{ data: Announcement }> {
    return $fetch('/api/announcements', { method: 'POST', body: data });
  }

  async updateAnnouncement(
    id: string,
    data: Partial<Announcement>,
  ): Promise<{ data: Announcement }> {
    return $fetch(`/api/announcements/${id}`, { method: 'PUT', body: data });
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await $fetch(`/api/announcements/${id}`, { method: 'DELETE' });
  }

  async publishAnnouncement(id: string): Promise<{ data: Announcement }> {
    return $fetch(`/api/announcements/${id}/publish`, { method: 'POST' });
  }

  async archiveAnnouncement(id: string): Promise<{ data: Announcement }> {
    return $fetch(`/api/announcements/${id}/archive`, { method: 'POST' });
  }

  async queryPublishedAnnouncements(
    limit?: number,
  ): Promise<PageResult<Announcement>> {
    const query: Record<string, string> = {};
    if (limit) query.limit = String(limit);
    return $fetch('/api/announcements/published', { query });
  }
}
