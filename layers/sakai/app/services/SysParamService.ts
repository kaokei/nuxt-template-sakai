import type { SysParam } from '~/types/sys-param';

export interface SysParamQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  name?: string;
  key?: string;
  type?: string;
  status?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

@Injectable()
export class SysParamService {
  async getList(
    params: SysParamQueryParams = {},
  ): Promise<PageResult<SysParam>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query[key] = String(value);
      }
    }
    return $fetch('/api/sys-params', { query });
  }

  async getSysParamById(id: string): Promise<SysParam | undefined> {
    try {
      return await $fetch(`/api/sys-params/${id}`);
    } catch {
      return undefined;
    }
  }

  async create(data: Omit<SysParam, 'id' | 'createTime'>): Promise<SysParam> {
    return $fetch('/api/sys-params', { method: 'POST', body: data });
  }

  async update(id: string, data: Partial<SysParam>): Promise<SysParam> {
    return $fetch(`/api/sys-params/${id}`, { method: 'PUT', body: data });
  }

  async delete(id: string): Promise<boolean> {
    await $fetch(`/api/sys-params/${id}`, { method: 'DELETE' });
    return true;
  }
}
