/** 短链实体 */
export interface ShortLink {
  id: string;
  /** 备注标题 */
  title: string;
  /** 目标原始 URL */
  originalUrl: string;
  /** 自定义短码（留空自动生成） */
  shortCode: string;
  /** 活动标签（用于分组筛选） */
  campaign: string;
  /** UTM 来源 */
  utmSource?: string;
  /** UTM 媒介 */
  utmMedium?: string;
  /** UTM 活动名 */
  utmCampaign?: string;
  /** UTM 关键词 */
  utmTerm?: string;
  /** UTM 内容 */
  utmContent?: string;
  /** 过期时间（ISO 字符串，为空永不过期） */
  expireAt?: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 列表查询参数 */
export interface ShortLinkQuery {
  keyword?: string;
  campaign?: string;
}
