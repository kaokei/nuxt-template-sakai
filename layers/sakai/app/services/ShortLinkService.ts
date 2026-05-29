import type { ShortLink, ShortLinkQuery } from '@sakai/types/short-link';
import { nanoid } from 'nanoid';

/** 生成 6 位随机短码 */
export function generateShortCode(): string {
  return nanoid(6);
}

/** 判断短链是否已过期 */
export function isExpired(link: ShortLink): boolean {
  if (!link.expireAt) return false;
  return new Date(link.expireAt).getTime() < Date.now();
}

@Injectable()
export class ShortLinkService {
  /** mock 数据存储（内存 Map） */
  private store: Map<string, ShortLink> = new Map();

  constructor() {
    this.seedMockData();
  }

  /** 填充示例数据 */
  private seedMockData(): void {
    const mocks: Omit<ShortLink, 'id'>[] = [
      {
        title: '618 大促主会场',
        originalUrl: 'https://shop.example.com/618',
        shortCode: '618main',
        campaign: '618大促',
        utmSource: 'wechat',
        utmMedium: 'social',
        utmCampaign: '618_2026',
        utmTerm: 'sale',
        utmContent: 'banner',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:00:00.000Z',
      },
      {
        title: '新品发布直播',
        originalUrl: 'https://live.example.com/new-product',
        shortCode: 'newlive',
        campaign: '新品发布',
        createdAt: '2026-05-22T14:30:00.000Z',
        updatedAt: '2026-05-22T14:30:00.000Z',
      },
      {
        title: '双十一预售（已过期）',
        originalUrl: 'https://shop.example.com/1111',
        shortCode: '1111pre',
        campaign: '双十一',
        expireAt: '2026-01-01T00:00:00.000Z',
        createdAt: '2025-10-20T08:00:00.000Z',
        updatedAt: '2025-10-20T08:00:00.000Z',
      },
      {
        title: '企业采购专区',
        originalUrl: 'https://biz.example.com/procurement',
        shortCode: 'bizproc',
        campaign: '企业采购',
        utmSource: 'email',
        utmMedium: 'newsletter',
        createdAt: '2026-05-25T09:00:00.000Z',
        updatedAt: '2026-05-25T09:00:00.000Z',
      },
      {
        title: '618 秒杀专场',
        originalUrl: 'https://shop.example.com/seckill',
        shortCode: 'sk618',
        campaign: '618大促',
        utmSource: 'douyin',
        utmMedium: 'video',
        utmCampaign: '618_2026',
        expireAt: '2026-06-20T23:59:59.000Z',
        createdAt: '2026-05-28T12:00:00.000Z',
        updatedAt: '2026-05-28T12:00:00.000Z',
      },
    ];

    for (const item of mocks) {
      const id = nanoid(12);
      this.store.set(id, { id, ...item });
    }
  }

  /** 查询短链列表（支持关键词搜索和活动标签筛选） */
  async list(query: ShortLinkQuery = {}): Promise<ShortLink[]> {
    let result = Array.from(this.store.values());

    if (query.keyword) {
      const kw = query.keyword.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(kw) ||
          l.shortCode.toLowerCase().includes(kw) ||
          l.originalUrl.toLowerCase().includes(kw),
      );
    }

    if (query.campaign) {
      result = result.filter((l) => l.campaign === query.campaign);
    }

    result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return result;
  }

  /** 获取单条短链 */
  async getById(id: string): Promise<ShortLink | undefined> {
    return this.store.get(id);
  }

  /** 创建短链 */
  async create(
    data: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ShortLink> {
    const id = nanoid(12);
    const now = new Date().toISOString();
    const link: ShortLink = { id, ...data, createdAt: now, updatedAt: now };
    this.store.set(id, link);
    return link;
  }

  /** 更新短链 */
  async update(
    id: string,
    data: Partial<Omit<ShortLink, 'id' | 'createdAt'>>,
  ): Promise<ShortLink> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`短链不存在: ${id}`);
    const updated: ShortLink = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.store.set(id, updated);
    return updated;
  }

  /** 删除单条短链 */
  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  /** 批量删除 */
  async batchDelete(ids: string[]): Promise<void> {
    for (const id of ids) {
      this.store.delete(id);
    }
  }

  /** 批量编辑 */
  async batchUpdate(
    ids: string[],
    data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    const now = new Date().toISOString();
    for (const id of ids) {
      const existing = this.store.get(id);
      if (existing) {
        this.store.set(id, { ...existing, ...data, updatedAt: now });
      }
    }
  }

  /** 批量创建 */
  async batchCreate(
    list: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<ShortLink[]> {
    const results: ShortLink[] = [];
    for (const item of list) {
      results.push(await this.create(item));
    }
    return results;
  }

  /** 获取所有活动标签（去重排序） */
  async getAllCampaigns(): Promise<string[]> {
    const campaigns = new Set<string>();
    for (const link of this.store.values()) {
      if (link.campaign) {
        campaigns.add(link.campaign);
      }
    }
    return Array.from(campaigns).sort();
  }
}
