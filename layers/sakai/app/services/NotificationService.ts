import type { NotificationRecord } from '~/types/notification';

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface NotificationQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
  type?: string;
  sendStatus?: string;
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class NotificationService {
  async queryRecords(
    params: NotificationQueryParams = {},
  ): Promise<PageResult<NotificationRecord>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/notifications/records', { query });
  }

  async getRecord(id: string): Promise<{ data: NotificationRecord }> {
    return $fetch(`/api/notifications/records/${id}`);
  }

  async retryRecord(id: string): Promise<{ data: NotificationRecord }> {
    return $fetch(`/api/notifications/records/${id}/retry`, { method: 'POST' });
  }
}
