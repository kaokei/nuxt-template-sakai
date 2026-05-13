/**
 * Mock 工具函数
 *
 * 提供 Mock 数据生成和操作的核心工具函数，供所有 Mock 服务共享使用。
 * 设计目标：无需额外依赖，纯函数，可组合，可预测。
 *
 * 使用示例：
 * ```ts
 * import { simulateDelay, randomInt } from '~/services/mock/mock-utils';
 * // 查询
 * await simulateDelay();
 * const users = generateMockUsers(50);
 * const page1 = paginate(sortBy(users, 'name', 1), 1, 10);
 * ```
 */

// ==================== 延迟模拟 ====================

/** 模拟网络延迟，范围 = ms ± random(0, jitter) */
export function simulateDelay(ms = 300, jitter = 200): Promise<void> {
  const actual = ms + Math.random() * jitter;
  return new Promise((resolve) => setTimeout(resolve, actual));
}

/** 快速延迟（列表查询用） */
export function quickDelay(): Promise<void> {
  return simulateDelay(200, 150);
}

/** 慢速延迟（增删改等需要感知的操作用） */
export function slowDelay(): Promise<void> {
  return simulateDelay(500, 300);
}

// ==================== 随机数据生成 ====================

/** 生成 [min, max] 闭区间的随机整数 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 生成 [min, max) 的随机浮点数，保留指定小数位 */
export function randomFloat(min: number, max: number, decimals = 2): number {
  const val = min + Math.random() * (max - min);
  return Number(val.toFixed(decimals));
}

/** 从数组中随机选一个元素 */
export function randomChoice<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

/** 从数组中随机选 n 个不重复的元素 */
export function randomSubset<T>(
  arr: readonly T[],
  min: number,
  max: number,
): T[] {
  const count = randomInt(min, Math.min(max, arr.length));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** 随机生成日期，范围 [now - daysBack, now] */
export function randomDate(daysBack = 365, now = new Date()): Date {
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

/** 从给定的枚举数组中按概率权重选择 */
export function weightedChoice<T>(arr: readonly T[], weights: number[]): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let r = Math.random() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i]!;
    if (r <= 0) return arr[i]!;
  }
  return arr[arr.length - 1]!;
}

// ==================== ID 生成 ====================

let _idCounter = Date.now();

/** 生成唯一 ID（时间戳 + 自增序号） */
export function generateId(prefix = ''): string {
  return `${prefix}${++_idCounter}`;
}

/** 重置 ID 计数器（测试用） */
export function resetIdCounter(): void {
  _idCounter = Date.now();
}

// ==================== 数组操作 ====================

/** 深拷贝（简化版，适用于纯数据对象） */
export function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/** 分页：从数组中截取指定页的数据，返回 { data, total } */
export function paginate<T>(
  items: T[],
  page: number,
  pageSize: number,
): { data: T[]; total: number } {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: items.slice(start, end),
    total,
  };
}

/** 对数组应用排序 */
export function applySort<T>(
  items: T[],
  sortField?: string,
  sortOrder?: number,
): T[] {
  if (!sortField) return items;

  const order = sortOrder ?? 1;
  const result = [...items];

  result.sort((a, b) => {
    const valA = (a as Record<string, unknown>)[sortField];
    const valB = (b as Record<string, unknown>)[sortField];

    if (valA instanceof Date && valB instanceof Date) {
      return (valA.getTime() - valB.getTime()) * order;
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * order;
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return valA.localeCompare(valB, 'zh-CN') * order;
    }

    const strA = String(valA ?? '');
    const strB = String(valB ?? '');
    return strA.localeCompare(strB, 'zh-CN') * order;
  });

  return result;
}

/** 筛选条件的类型 */
export interface FilterCondition {
  /** 字段路径，如 'title'、'user.name' */
  field: string;
  /** 筛选值 */
  value: unknown;
  /** 匹配模式 */
  operator?:
    | 'contains'
    | 'equals'
    | 'startsWith'
    | 'endsWith'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'in'
    | 'between';
}

/** 通用筛选函数：按条件过滤数组 */
export function applyFilters<T>(
  items: T[],
  conditions: FilterCondition[],
): T[] {
  if (!conditions || conditions.length === 0) return items;

  return items.filter((item) => {
    return conditions.every((cond) => {
      const value = getNestedValue(item, cond.field);
      const target = cond.value;

      if (target === undefined || target === null || target === '') return true;
      if (typeof target === 'string' && target.trim() === '') return true;
      if (Array.isArray(target) && target.length === 0) return true;

      const op = cond.operator || 'contains';

      switch (op) {
        case 'contains': {
          if (typeof value === 'string' && typeof target === 'string') {
            return value.toLowerCase().includes(target.toLowerCase());
          }
          return false;
        }
        case 'equals':
          return value === target;
        case 'startsWith':
          return typeof value === 'string' && typeof target === 'string'
            ? value.toLowerCase().startsWith(target.toLowerCase())
            : false;
        case 'endsWith':
          return typeof value === 'string' && typeof target === 'string'
            ? value.toLowerCase().endsWith(target.toLowerCase())
            : false;
        case 'gt':
          return typeof value === 'number' && typeof target === 'number'
            ? value > target
            : false;
        case 'gte':
          return typeof value === 'number' && typeof target === 'number'
            ? value >= target
            : false;
        case 'lt':
          return typeof value === 'number' && typeof target === 'number'
            ? value < target
            : false;
        case 'lte':
          return typeof value === 'number' && typeof target === 'number'
            ? value <= target
            : false;
        case 'in':
          return Array.isArray(target) && (target as unknown[]).includes(value);
        case 'between': {
          if (!Array.isArray(target) || target.length !== 2) return false;
          if (
            typeof value !== 'number' ||
            typeof target[0] !== 'number' ||
            typeof target[1] !== 'number'
          )
            return false;
          return value >= target[0] && value <= target[1];
        }
        default:
          return true;
      }
    });
  });
}

/** 便捷筛选构建器：从对象构建筛选条件（对象中非空字段参与筛选，默认用 contains 模糊匹配） */
export function buildFiltersFromMap(
  filterMap: Record<string, unknown>,
  fieldOperatorMap?: Record<string, FilterCondition['operator']>,
): FilterCondition[] {
  return Object.entries(filterMap)
    .filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        v !== '' &&
        !(Array.isArray(v) && v.length === 0),
    )
    .map(([field, value]) => ({
      field,
      value,
      operator:
        fieldOperatorMap?.[field] ??
        (typeof value === 'string' ? 'contains' : 'equals'),
    }));
}

/** 获取嵌套字段值，如 getNestedValue(obj, 'user.name') */
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
