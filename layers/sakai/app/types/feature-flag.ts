/** 功能开关类型（包含环境规则） */
export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'multivariate';
  tags: string[];
  owner: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  rules: FlagRule[];
}

/** 环境 */
export type Environment = 'dev' | 'staging' | 'prod';

/** 发布策略 */
export type FlagStrategy = 'off' | 'on' | 'gradual' | 'whitelist';

/** 开关环境规则 */
export interface FlagRule {
  /** 所属开关 key */
  flagKey: string;
  /** 环境 */
  environment: Environment;
  /** 发布策略 */
  strategy: FlagStrategy;
  /** 渐进发布百分比 0-100，strategy='gradual' 时生效 */
  rolloutPercent: number;
  /** 白名单用户 ID 列表，strategy='whitelist' 时生效 */
  userIds: number[];
  /** 更新时间 */
  updatedAt: string;
}

/** 开关查询参数 */
export interface FeatureFlagQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  key?: string;
  name?: string;
  tag?: string;
  status?: string;
  owner?: string;
  updatedAtFrom?: string;
  updatedAtTo?: string;
}

/** 分页结果 */
export interface PageResult<T> {
  data: T[];
  total: number;
}

/** 开关存储结构（运行时前端缓存用） */
export interface FlagStore {
  /** 开关 key -> 当前环境下的评估结果 */
  values: Record<string, boolean>;
  /** 最后更新时间戳 */
  lastFetched: number;
}

/** 开关环境快照（管理页面表格展示用） */
export interface FlagEnvSnapshot {
  flagKey: string;
  flagName: string;
  /** 每个环境的策略摘要 */
  envSummary: Record<
    Environment,
    { strategy: FlagStrategy; rolloutPercent: number }
  >;
}
