/** 公告状态 */
export type AnnouncementStatus =
  | 'draft'
  | 'published'
  | 'scheduled'
  | 'archived';

/** 公告实体 */
export interface Announcement {
  id: string;
  /** 标题 */
  title: string;
  /** 正文（富文本 HTML） */
  content: string;
  /** 摘要（列表展示用） */
  summary?: string;
  /** 封面图 */
  coverImage?: string;
  /** 状态 */
  status: AnnouncementStatus;
  /** 是否置顶 */
  isPinned: boolean;
  /** 实际发布时间（已发布才有值） */
  publishedAt?: string;
  /** 定时发布时间 */
  scheduledAt?: string;
  /** 下架时间 */
  archivedAt?: string;
  /** 创建人 ID */
  createdBy: string;
  /** 阅读量 */
  viewCount: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 公告表单数据（新建/编辑时使用） */
export interface AnnouncementFormData {
  title: string;
  content: string;
  summary?: string;
  coverImage?: string;
  isPinned: boolean;
  scheduledAt?: string;
}
