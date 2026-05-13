import {
  applyFilters,
  applySort,
  buildFiltersFromMap,
  cloneData,
  generateId,
  paginate,
  quickDelay,
  simulateDelay,
  slowDelay,
} from './mock-utils';
import type { FilterCondition } from './mock-utils';

/**
 * 基础 Mock 查询参数
 */
export interface MockQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  /** 自动构建筛选条件的字段映射表（字段名 → 筛选值，空值跳过） */
  filters?: Record<string, unknown>;
  /** 精细控制的筛选条件列表（与 filters 二选一或组合使用） */
  filterConditions?: FilterCondition[];
  /** 每个字段使用的查询模式（默认 contains 模糊匹配） */
  fieldOperators?: Record<string, FilterCondition['operator']>;
}

/**
 * 分页查询结果
 */
export interface MockPageResult<T> {
  data: T[];
  total: number;
}

/**
 * 带 ID 的类型约束
 */
export type WithId = { id: string };

/**
 * Mock 数据服务基类
 *
 * 封装了在内存数组上执行 CRUD + 分页/排序/筛选 的通用逻辑。
 * 子类只需调用 `initData()` 初始化静态数据，即可获得全套 CRUD 能力。
 *
 * @example 子类定义
 * ```ts
 * @Injectable()
 * export class ProductMockService extends BaseMockService<Product> {
 *   constructor() {
 *     super();
 *     this.initData(generateMockProducts(100));
 *   }
 * }
 * ```
 */
export class BaseMockService<T extends WithId> {
  protected items: T[] = [];

  /**
   * 初始化或重置 mock 数据
   */
  protected initData(data: T[]): void {
    this.items = cloneData(data);
  }

  // ==================== 查询 ====================

  /**
   * 分页查询，内置筛选 + 排序 + 分页
   */
  async query(params: MockQueryParams = {}): Promise<MockPageResult<T>> {
    await simulateDelay(200, 150);

    let result = cloneData(this.items);

    // 1. 筛选
    if (params.filters) {
      const conditions = buildFiltersFromMap(
        params.filters,
        params.fieldOperators,
      );
      result = applyFilters(result, conditions);
    }
    if (params.filterConditions && params.filterConditions.length > 0) {
      result = applyFilters(result, params.filterConditions);
    }

    // 2. 排序
    result = applySort(result, params.sortField, params.sortOrder);

    // 3. 分页
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    return paginate(result, page, pageSize);
  }

  /**
   * 获取所有数据（不分页），常用于导出全部
   */
  async queryAll(
    params: Omit<MockQueryParams, 'page' | 'pageSize'> = {},
  ): Promise<T[]> {
    let result = cloneData(this.items);

    if (params.filters) {
      const conditions = buildFiltersFromMap(
        params.filters,
        params.fieldOperators,
      );
      result = applyFilters(result, conditions);
    }
    if (params.filterConditions) {
      result = applyFilters(result, params.filterConditions);
    }
    result = applySort(result, params.sortField, params.sortOrder);

    return result;
  }

  /**
   * 根据 ID 获取单条数据
   */
  async getById(id: string): Promise<T | undefined> {
    await quickDelay();
    return this.items.find((item) => item.id === id);
  }

  // ==================== 写入 ====================

  /**
   * 新增数据
   */
  async create(data: Omit<T, 'id'>): Promise<T> {
    await slowDelay();

    const newItem = {
      ...cloneData(data as Record<string, unknown>),
      id: generateId(),
    } as unknown as T;

    this.items.push(newItem);
    return newItem;
  }

  /**
   * 更新数据
   */
  async update(id: string, data: Partial<T>): Promise<T | undefined> {
    await slowDelay();

    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    this.items[index] = {
      ...this.items[index]!,
      ...cloneData(data as Record<string, unknown>),
      id, // 防止覆盖 id
    };

    return this.items[index];
  }

  /**
   * 删除单条数据
   */
  async delete(id: string): Promise<boolean> {
    await slowDelay();

    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  /**
   * 批量删除
   */
  async batchDelete(ids: string[]): Promise<number> {
    await slowDelay();

    const before = this.items.length;
    this.items = this.items.filter((item) => !ids.includes(item.id));
    return before - this.items.length;
  }

  // ==================== 工具 ====================

  /**
   * 获取当前 mock 数据总量
   */
  count(): number {
    return this.items.length;
  }

  /**
   * 重置为初始数据
   */
  reset(initialData: T[]): void {
    this.initData(initialData);
  }
}
