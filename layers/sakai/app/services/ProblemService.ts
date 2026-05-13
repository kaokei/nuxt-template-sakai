import type { MockQueryParams } from '~/services/mock/base-mock.service';
import {
  type MockProblem,
  ProblemMockService,
} from './mock/problem-mock.service';

/**
 * 题目数据模型
 *
 * 注：Mock 层使用 MockProblem 类型，当前服务类型与之保持一致。
 * 当接入真实 API 后，此类型由后端接口定义驱动。
 */
export type Problem = MockProblem;

/** 题目查询参数 */
export interface ProblemQueryParams extends MockQueryParams {}

/** 分页结果 */
export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

@Injectable()
export class ProblemService {
  @Inject(ProblemMockService)
  private mockService!: ProblemMockService;

  /** 所有标签选项 */
  getAllTags(): string[] {
    return [
      '数组',
      '字符串',
      '哈希表',
      '动态规划',
      '贪心',
      '排序',
      '二分查找',
      '双指针',
      '树',
      '图',
      '链表',
      '栈',
      '队列',
      '堆',
      '回溯',
      '分治',
      '位运算',
      '数学',
      '深度优先搜索',
      '广度优先搜索',
    ];
  }

  /** 难度选项 */
  getDifficultyOptions(): SelectOption[] {
    return [
      { label: '简单', value: 'Easy' },
      { label: '中等', value: 'Medium' },
      { label: '困难', value: 'Hard' },
    ];
  }

  /** 可见级别选项 */
  getAccessLevelOptions(): SelectOption[] {
    return [
      { label: '公开', value: 'Public' },
      { label: '私有', value: 'Private' },
      { label: '共享', value: 'Shared' },
    ];
  }

  /** 所有者选项 */
  getOwnerOptions(): SelectOption[] {
    return [
      '张三',
      '李四',
      '王五',
      '赵六',
      '孙七',
      '周八',
      '吴九',
      '郑十',
      '陈一',
      '刘二',
    ].map((name) => ({ label: name, value: name }));
  }

  /** 查询列表（分页+筛选+排序） */
  async queryProblems(
    params: ProblemQueryParams = {},
  ): Promise<PageResult<Problem>> {
    const result = await this.mockService.query(params);
    return { data: result.data, total: result.total };
  }

  /** 根据 ID 查询 */
  async getProblemById(id: string): Promise<Problem | undefined> {
    return this.mockService.getById(id);
  }

  /** 新增题目 */
  async createProblem(
    data: Omit<
      Problem,
      'id' | 'problemNumber' | 'createTime' | 'lastModifiedTime'
    >,
  ): Promise<Problem> {
    const now = new Date();
    const newData = {
      ...data,
      problemNumber: `OJ-${Date.now()}`,
      createTime: now,
      lastModifiedTime: now,
    };
    return this.mockService.create(newData as unknown as Omit<Problem, 'id'>);
  }

  /** 更新题目 */
  async updateProblem(
    id: string,
    data: Partial<Problem>,
  ): Promise<Problem | undefined> {
    const updateData = {
      ...data,
      lastModifiedTime: new Date(),
    };
    return this.mockService.update(id, updateData);
  }

  /** 删除单条题目 */
  async deleteProblem(id: string): Promise<boolean> {
    return this.mockService.delete(id);
  }

  /** 批量删除 */
  async deleteProblems(ids: string[]): Promise<number> {
    return this.mockService.batchDelete(ids);
  }
}
