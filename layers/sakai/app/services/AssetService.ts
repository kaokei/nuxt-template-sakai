import type { Asset, AssetQuery } from '@sakai/types/asset';

@Injectable()
export class AssetService {
  async list(sceneId: string, query: AssetQuery = {}): Promise<Asset[]> {
    const searchParams: Record<string, string> = {};
    if (query.keyword) searchParams.keyword = query.keyword;
    if (query.tags) searchParams.tags = query.tags;
    if (query.mimeCategory) searchParams.mimeCategory = query.mimeCategory;
    return $fetch<Asset[]>(`/api/scenes/${sceneId}/assets`, {
      query: searchParams,
    });
  }

  async create(
    sceneId: string,
    file: File,
    data: {
      title?: string;
      description?: string;
      tags: string[];
      behavior: string;
    },
  ): Promise<Asset> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', data.title || '');
    formData.append('description', data.description || '');
    formData.append('tags', data.tags.join(','));
    formData.append('behavior', data.behavior);

    return $fetch<Asset>(`/api/scenes/${sceneId}/assets`, {
      method: 'POST',
      body: formData,
    });
  }

  async batchCreate(
    sceneId: string,
    files: File[],
    data: { tags: string[]; behavior: string },
  ): Promise<Asset[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('tags', data.tags.join(','));
    formData.append('behavior', data.behavior);

    return $fetch<Asset[]>(`/api/scenes/${sceneId}/assets/batch`, {
      method: 'POST',
      body: formData,
    });
  }

  async update(
    sceneId: string,
    id: string,
    data: Partial<Omit<Asset, 'id' | 'sceneId' | 'url' | 'createdAt'>> & {
      file?: File;
    },
  ): Promise<Asset> {
    const formData = new FormData();
    if (data.file) formData.append('file', data.file);
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.description !== undefined)
      formData.append('description', data.description);
    if (data.tags) formData.append('tags', data.tags.join(','));
    if (data.behavior) formData.append('behavior', data.behavior);

    return $fetch<Asset>(`/api/scenes/${sceneId}/assets/${id}`, {
      method: 'PUT',
      body: formData,
    });
  }

  async delete(sceneId: string, id: string): Promise<void> {
    await $fetch(`/api/scenes/${sceneId}/assets/${id}`, { method: 'DELETE' });
  }

  async batchDelete(
    sceneId: string,
    ids: string[],
  ): Promise<{ deleted: number }> {
    return $fetch<{ deleted: number }>(
      `/api/scenes/${sceneId}/assets/batch-delete`,
      {
        method: 'POST',
        body: { ids },
      },
    );
  }

  async getTags(sceneId: string): Promise<string[]> {
    return $fetch<string[]>(`/api/scenes/${sceneId}/assets/tags`);
  }
}
