/** 缓存项 */
export interface CacheItem {
  cacheName: string;
  keyCount: number;
  ttl: string;
  size: string;
  type: string;
  remark: string;
  createTime: string;
}

/** 缓存列表查询参数 */
export interface CacheListQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  cacheName?: string;
  type?: string;
}

@Injectable()
export class CacheListService {
  /** 查询缓存列表 */
  async queryList(
    params: CacheListQueryParams = {},
  ): Promise<{ data: CacheItem[]; total: number }> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/cache-list', { query });
  }

  /** 清除单个缓存 */
  async clearOne(
    cacheName: string,
  ): Promise<{ success: boolean; message: string }> {
    return $fetch(`/api/cache-list/${cacheName}`, { method: 'DELETE' });
  }

  /** 批量清除缓存 */
  async clearBatch(
    cacheNames: string[],
  ): Promise<{ success: boolean; message: string }> {
    return $fetch('/api/cache-list', {
      method: 'DELETE',
      body: { cacheNames },
    });
  }

  /** 查看缓存详情 */
  async getDetail(cacheName: string): Promise<CacheItem> {
    return $fetch(`/api/cache-list/${cacheName}`);
  }
}
