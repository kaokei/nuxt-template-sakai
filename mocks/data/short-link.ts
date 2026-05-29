/** 短链实体 */
export interface ShortLink {
  id: string;
  title: string;
  originalUrl: string;
  shortCode: string;
  campaign: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  expireAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** 短链查询参数 */
export interface ShortLinkQuery {
  keyword?: string;
  campaign?: string;
}

export const SHORT_LINK_LIST: ShortLink[] = [
  {
    id: 'sl-001',
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
    id: 'sl-002',
    title: '新品发布直播',
    originalUrl: 'https://live.example.com/new-product',
    shortCode: 'newlive',
    campaign: '新品发布',
    createdAt: '2026-05-22T14:30:00.000Z',
    updatedAt: '2026-05-22T14:30:00.000Z',
  },
  {
    id: 'sl-003',
    title: '双十一预售（已过期）',
    originalUrl: 'https://shop.example.com/1111',
    shortCode: '1111pre',
    campaign: '双十一',
    expireAt: '2026-01-01T00:00:00.000Z',
    createdAt: '2025-10-20T08:00:00.000Z',
    updatedAt: '2025-10-20T08:00:00.000Z',
  },
  {
    id: 'sl-004',
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
    id: 'sl-005',
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
