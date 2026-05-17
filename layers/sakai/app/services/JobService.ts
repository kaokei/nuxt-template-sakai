import type { Job } from '~/types/job';

export interface JobQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  name?: string;
  group?: string;
  status?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

@Injectable()
export class JobService {
  async getList(params: JobQueryParams = {}): Promise<PageResult<Job>> {
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
    return $fetch('/api/jobs', { query });
  }

  async getJobById(id: string): Promise<Job | undefined> {
    try {
      return await $fetch<Job>(`/api/jobs/${id}`);
    } catch {
      return undefined;
    }
  }

  async update(id: string, data: Partial<Job>): Promise<Job> {
    return $fetch<Job>(`/api/jobs/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async execute(id: string): Promise<void> {
    await $fetch(`/api/jobs/${id}/execute`, { method: 'POST' });
  }

  async pause(id: string): Promise<void> {
    await $fetch(`/api/jobs/${id}/pause`, { method: 'POST' });
  }

  async resume(id: string): Promise<void> {
    await $fetch(`/api/jobs/${id}/resume`, { method: 'POST' });
  }

  async deleteJob(id: string): Promise<void> {
    await $fetch(`/api/jobs/${id}`, { method: 'DELETE' });
  }
}
