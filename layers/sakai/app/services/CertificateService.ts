import type {
  CertificateOption,
  CertificateQuery,
  CertificateTemplate,
  PageResult,
} from '@sakai/types/certificate';

@Injectable()
export class CertificateService {
  async queryList(
    params: CertificateQuery = {},
  ): Promise<PageResult<CertificateTemplate>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch<PageResult<CertificateTemplate>>(
      '/api/certificate-templates',
      { query },
    );
  }

  async getById(id: string): Promise<CertificateTemplate> {
    return $fetch<CertificateTemplate>(`/api/certificate-templates/${id}`);
  }

  async create(
    data: Omit<CertificateTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CertificateTemplate> {
    return $fetch<CertificateTemplate>('/api/certificate-templates', {
      method: 'POST',
      body: data,
    });
  }

  async update(
    id: string,
    data: Partial<CertificateTemplate>,
  ): Promise<CertificateTemplate> {
    return $fetch<CertificateTemplate>(`/api/certificate-templates/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    await $fetch(`/api/certificate-templates/${id}`, { method: 'DELETE' });
  }

  async getOptions(): Promise<CertificateOption[]> {
    return $fetch<CertificateOption[]>('/api/certificate-templates/options');
  }
}
