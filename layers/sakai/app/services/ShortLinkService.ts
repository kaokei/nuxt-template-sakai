import type { ShortLink, ShortLinkQuery } from '@sakai/types/short-link';
import { nanoid } from 'nanoid';

export function generateShortCode(): string {
  return nanoid(6);
}

export function isExpired(link: ShortLink): boolean {
  if (!link.expireAt) return false;
  return new Date(link.expireAt).getTime() < Date.now();
}

@Injectable()
export class ShortLinkService {
  async list(query: ShortLinkQuery = {}): Promise<ShortLink[]> {
    const searchParams: Record<string, string> = {};
    if (query.keyword) searchParams.keyword = query.keyword;
    if (query.campaign) searchParams.campaign = query.campaign;
    return $fetch<ShortLink[]>('/api/short-links', {
      query: searchParams,
    });
  }

  async getById(id: string): Promise<ShortLink | undefined> {
    try {
      return await $fetch<ShortLink>(`/api/short-links/${id}`);
    } catch {
      return undefined;
    }
  }

  async create(
    data: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ShortLink> {
    return $fetch<ShortLink>('/api/short-links', {
      method: 'POST',
      body: data,
    });
  }

  async update(
    id: string,
    data: Partial<Omit<ShortLink, 'id' | 'createdAt'>>,
  ): Promise<ShortLink> {
    return $fetch<ShortLink>(`/api/short-links/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    await $fetch(`/api/short-links/${id}`, { method: 'DELETE' });
  }

  async batchDelete(
    ids: string[],
  ): Promise<{ success: boolean; deleted: number }> {
    return $fetch('/api/short-links/batch-delete', {
      method: 'POST',
      body: { ids },
    });
  }

  async batchUpdate(
    ids: string[],
    data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    await $fetch('/api/short-links/batch-update', {
      method: 'POST',
      body: { ids, data },
    });
  }

  async batchCreate(
    list: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<ShortLink[]> {
    return $fetch<ShortLink[]>('/api/short-links/batch-create', {
      method: 'POST',
      body: { list },
    });
  }

  async getAllCampaigns(): Promise<string[]> {
    return $fetch<string[]>('/api/short-links/campaigns');
  }
}
