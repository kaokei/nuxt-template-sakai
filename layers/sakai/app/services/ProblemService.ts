export interface Problem {
  id: string;
  problemNumber: string;
  title: string;
  owner: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  acceptanceRate: number;
  submissions: number;
  timeLimit: number;
  memoryLimit: number;
  createTime: string;
  lastModifiedTime: string;
  accessLevel: 'Public' | 'Private' | 'Shared';
  description: string;
}

export interface ProblemQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  problemNumber?: string;
  title?: string;
  owner?: string;
  difficulty?: string;
  tags?: string[];
  accessLevel?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

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

  getDifficultyOptions(): SelectOption[] {
    return [
      { label: '简单', value: 'Easy' },
      { label: '中等', value: 'Medium' },
      { label: '困难', value: 'Hard' },
    ];
  }

  getAccessLevelOptions(): SelectOption[] {
    return [
      { label: '公开', value: 'Public' },
      { label: '私有', value: 'Private' },
      { label: '共享', value: 'Shared' },
    ];
  }

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

  async queryProblems(
    params: ProblemQueryParams = {},
  ): Promise<PageResult<Problem>> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query.set(key, String(value));
      }
    }
    return $fetch('/api/problems', { query });
  }

  async getProblemById(id: string): Promise<Problem | undefined> {
    try {
      return await $fetch(`/api/problems/${id}`);
    } catch {
      return undefined;
    }
  }

  async createProblem(
    data: Omit<
      Problem,
      'id' | 'problemNumber' | 'createTime' | 'lastModifiedTime'
    >,
  ): Promise<Problem> {
    return $fetch('/api/problems', { method: 'POST', body: data });
  }

  async updateProblem(id: string, data: Partial<Problem>): Promise<Problem> {
    return $fetch(`/api/problems/${id}`, { method: 'PUT', body: data });
  }

  async deleteProblem(id: string): Promise<boolean> {
    await $fetch(`/api/problems/${id}`, { method: 'DELETE' });
    return true;
  }

  async deleteProblems(ids: string[]): Promise<number> {
    const res = await $fetch('/api/problems/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return (res as { deleted: number }).deleted;
  }
}
