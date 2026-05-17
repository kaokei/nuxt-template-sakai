import type { Backup } from '~/types/backup';

export interface BackupQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  name?: string;
  status?: string;
  type?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

@Injectable()
export class BackupService {
  async queryBackups(
    params: BackupQueryParams = {},
  ): Promise<PageResult<Backup>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query[key] =
          value instanceof Date ? value.toISOString() : String(value);
      }
    }
    return $fetch('/api/backups', { query });
  }

  async getBackupById(id: string): Promise<Backup | undefined> {
    try {
      return await $fetch(`/api/backups/${id}`);
    } catch {
      return undefined;
    }
  }

  async createBackup(data: Partial<Backup>): Promise<Backup> {
    return $fetch('/api/backups', {
      method: 'POST',
      body: data,
    });
  }

  async deleteBackup(id: string): Promise<void> {
    await $fetch(`/api/backups/${id}`, {
      method: 'DELETE',
    });
  }
}
