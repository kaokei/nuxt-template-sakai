import type { Post } from '~/types/post';

/** 岗位分页查询参数 */
export interface PostQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  name?: string;
  code?: string;
  status?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

/** 岗位分页结果 */
export interface PageResult<T> {
  data: T[];
  total: number;
}

@Injectable()
export class PostService {
  async getList(params: PostQueryParams = {}): Promise<PageResult<Post>> {
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
    return $fetch('/api/posts', { query });
  }

  async getById(id: string): Promise<Post | undefined> {
    try {
      return await $fetch(`/api/posts/${id}`);
    } catch {
      return undefined;
    }
  }

  async create(data: Omit<Post, 'id' | 'createTime'>): Promise<Post> {
    return $fetch('/api/posts', { method: 'POST', body: data });
  }

  async update(id: string, data: Partial<Post>): Promise<Post> {
    return $fetch(`/api/posts/${id}`, { method: 'PUT', body: data });
  }

  async delete(id: string): Promise<void> {
    await $fetch(`/api/posts/${id}`, { method: 'DELETE' });
  }
}
