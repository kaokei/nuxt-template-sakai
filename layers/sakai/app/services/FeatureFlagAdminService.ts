import type { FeatureFlag, FeatureFlagQueryParams } from '~/types/feature-flag';

export type { FeatureFlag, FeatureFlagQueryParams };

@Injectable()
export class FeatureFlagAdminService {
  async queryFlags(
    params: Record<string, any>,
  ): Promise<{ data: any[]; total: number }> {
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
    return $fetch('/api/feature-flags/admin', { query });
  }

  async getFlagByKey(key: string): Promise<any> {
    return $fetch(`/api/feature-flags/admin/${key}`);
  }

  async createFlag(data: any): Promise<any> {
    return $fetch('/api/feature-flags/admin', { method: 'POST', body: data });
  }

  async updateFlag(key: string, data: any): Promise<any> {
    return $fetch(`/api/feature-flags/admin/${key}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteFlag(key: string): Promise<boolean> {
    await $fetch(`/api/feature-flags/admin/${key}`, { method: 'DELETE' });
    return true;
  }

  async getTagOptions(): Promise<string[]> {
    return $fetch('/api/feature-flags/admin/tags');
  }

  async updateFlagRule(key: string, env: string, rule: any): Promise<any> {
    return $fetch(`/api/feature-flags/admin/${key}/rules/${env}`, {
      method: 'PUT',
      body: rule,
    });
  }
}
