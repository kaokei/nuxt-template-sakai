/** 通知类型 */
export type NotificationType = 'announcement' | 'system' | 'business';

/** 通知发送状态 */
export type NotificationSendStatus = 'pending' | 'sent' | 'failed';

/** 发送目标类型 */
export type NotificationTargetType = 'all' | 'role' | 'user';

/** 通知记录（管理员视角的发送记录） */
export interface NotificationRecord {
  id: string;
  /** 通知类型 */
  type: NotificationType;
  /** 标题 */
  title: string;
  /** 简要内容 */
  content: string;
  /** 来源 ID（公告通知时 = Announcement.id） */
  sourceId?: string;
  /** 来源类型 */
  sourceType?: 'announcement';
  /** 发送目标类型 */
  targetType: NotificationTargetType;
  /** 发送目标描述（如"全体用户"、"技术部"、"张三"） */
  targetDesc: string;
  /** 目标 ID 列表 */
  targetIds: string[];
  /** 发送状态 */
  sendStatus: NotificationSendStatus;
  /** 已读数 */
  readCount: number;
  /** 应送达总数 */
  totalCount: number;
  /** 创建时间 */
  createdAt: string;
  /** 实际发送时间 */
  sentAt?: string;
  /** 发送人 ID */
  senderId: string;
  /** 发送人名称 */
  senderName: string;
}

/** 用户通知状态（用户视角的通知：已读/未读） */
export interface UserNotification {
  id: string;
  /** 关联 NotificationRecord.id */
  recordId: string;
  /** 用户 ID */
  userId: string;
  /** 通知类型 */
  type: NotificationType;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 来源 ID（用于跳转） */
  sourceId?: string;
  /** 来源类型 */
  sourceType?: 'announcement';
  /** 是否已读 */
  isRead: boolean;
  /** 已读时间 */
  readAt?: string;
  /** 创建时间 */
  createdAt: string;
}

/** 未读通知统计 */
export interface UnreadNotificationCount {
  /** 未读通知总数 */
  total: number;
  /** 按类型分组的未读数 */
  byType: Record<NotificationType, number>;
}
