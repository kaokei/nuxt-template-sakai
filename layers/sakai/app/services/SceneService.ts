import type { Bucket, Scene } from '@sakai/types/asset';

@Injectable()
export class SceneService {
  async getBuckets(): Promise<Bucket[]> {
    return $fetch<Bucket[]>('/api/oss/buckets');
  }

  async list(): Promise<Scene[]> {
    return $fetch<Scene[]>('/api/scenes');
  }

  async create(
    data: Omit<Scene, 'id' | 'assetCount' | 'createdAt' | 'updatedAt'>,
  ): Promise<Scene> {
    return $fetch<Scene>('/api/scenes', {
      method: 'POST',
      body: data,
    });
  }

  async update(
    id: string,
    data: Partial<Omit<Scene, 'id' | 'bucketId' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Scene> {
    return $fetch<Scene>(`/api/scenes/${id}`, {
      method: 'PUT',
      body: data,
    });
  }

  async delete(id: string): Promise<void> {
    await $fetch(`/api/scenes/${id}`, { method: 'DELETE' });
  }
}
