import type { AreaCode } from '~/types/area-code';

export interface AreaCodeQueryParams {
  sortField?: string;
  sortOrder?: number;
  regionName?: string;
  code?: string;
  continent?: string;
  enabled?: boolean;
}

export interface ListResult<T> {
  data: T[];
  total: number;
  enabledCount: number;
}

// 预设验证规则模板
export const PHONE_RULE_TEMPLATES: { label: string; rule: string }[] = [
  { label: '中国大陆 11位', rule: '^1[3-9]\\d{9}$' },
  { label: '通用 7-15位', rule: '^\\d{7,15}$' },
  { label: '美国/加拿大 10位', rule: '^\\d{10}$' },
  { label: '英国 10-11位', rule: '^\\d{10,11}$' },
  { label: '日本 10-11位', rule: '^\\d{10,11}$' },
  { label: '印度 10位', rule: '^\\d{10}$' },
  { label: '巴西 10-11位', rule: '^\\d{10,11}$' },
  { label: '澳大利亚 9-10位', rule: '^\\d{9,10}$' },
];

@Injectable()
export class AreaCodeService {
  async getList(
    params: AreaCodeQueryParams = {},
  ): Promise<ListResult<AreaCode>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/area-codes', { query });
  }

  async create(data: Omit<AreaCode, 'id'>): Promise<AreaCode> {
    return $fetch('/api/area-codes', { method: 'POST', body: data });
  }

  async update(id: string, data: Partial<AreaCode>): Promise<AreaCode> {
    return $fetch(`/api/area-codes/${id}`, { method: 'PUT', body: data });
  }

  async delete(id: string): Promise<{ success: boolean }> {
    return $fetch(`/api/area-codes/${id}`, { method: 'DELETE' });
  }

  async batchDelete(
    ids: string[],
  ): Promise<{ success: boolean; deleted: number }> {
    return $fetch('/api/area-codes/batch-delete', {
      method: 'POST',
      body: { ids },
    });
  }

  async batchUpdate(ids: string[], data: Partial<AreaCode>): Promise<void> {
    await $fetch('/api/area-codes/batch-update', {
      method: 'POST',
      body: { ids, data },
    });
  }

  async checkExists(
    field: 'code' | 'regionName' | 'countryCode',
    value: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, string> = { field, value };
    if (excludeId) query.excludeId = excludeId;
    const res = await $fetch<{ exists: boolean }>(
      '/api/area-codes/check-exists',
      { query },
    );
    return res.exists;
  }
}
