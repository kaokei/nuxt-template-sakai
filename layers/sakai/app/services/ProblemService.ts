/** OJ 题目数据模型 */
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
  createTime: Date;
  lastModifiedTime: Date;
  accessLevel: 'Public' | 'Private' | 'Shared';
  description: string;
}

/** 题目查询参数 */
export interface ProblemQueryParams {
  problemNumber?: string;
  title?: string;
  owner?: string;
  difficulty?: string;
  tags?: string[];
  accessLevel?: string;
  createTimeFrom?: Date;
  createTimeTo?: Date;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, ms + Math.random() * 200),
  );
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

const allTags = [
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

const owners = [
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
];

const difficulties: Problem['difficulty'][] = ['Easy', 'Medium', 'Hard'];
const accessLevels: Problem['accessLevel'][] = ['Public', 'Private', 'Shared'];

function randomSubset<T>(arr: T[], min: number, max: number): T[] {
  const count = randomInt(min, max);
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

@Injectable()
export class ProblemService {
  private problems: Problem[] = [];

  constructor() {
    this.initMockData();
  }

  private initMockData(): void {
    const titles = [
      '两数之和',
      '无重复字符的最长子串',
      '寻找两个正序数组的中位数',
      '最长回文子串',
      'Z 字形变换',
      '整数反转',
      '字符串转换整数',
      '回文数',
      '正则表达式匹配',
      '盛最多水的容器',
      '整数转罗马数字',
      '三数之和',
      '最接近的三数之和',
      '电话号码的字母组合',
      '四数之和',
      '删除链表的倒数第 N 个结点',
      '有效的括号',
      '合并两个有序链表',
      '括号生成',
      '合并K个升序链表',
      '两两交换链表中的节点',
      '删除有序数组中的重复项',
      '移除元素',
      '实现 strStr()',
      '两数相除',
      '串联所有单词的子串',
      '下一个排列',
      '最长有效括号',
      '搜索旋转排序数组',
      '在排序数组中查找元素的第一个和最后一个位置',
      '搜索插入位置',
      '有效的数独',
      '解数独',
      '外观数列',
      '组合总和',
      '组合总和 II',
      '缺失的第一个正数',
      '接雨水',
      '字符串相乘',
      '通配符匹配',
      '跳跃游戏',
      '跳跃游戏 II',
      '全排列',
      '全排列 II',
      '旋转图像',
      '字母异位词分组',
      'Pow(x, n)',
      'N 皇后',
      'N 皇后 II',
      '最大子数组和',
      '螺旋矩阵',
      '跳跃游戏 III',
      '合并区间',
      '插入区间',
      '最后一个单词的长度',
      '螺旋矩阵 II',
      '第k个排列',
      '旋转链表',
      '不同路径',
      '不同路径 II',
    ];

    for (let i = 0; i < 60; i++) {
      const id = `${1001 + i}`;
      const createTime = randomDate(365);
      const lastModifiedTime = randomDate(Math.floor(Math.random() * 30) + 1);

      if (lastModifiedTime < createTime) {
        lastModifiedTime.setTime(
          createTime.getTime() + Math.random() * 30 * 86400000,
        );
      }

      this.problems.push({
        id,
        problemNumber: `OJ-${id}`,
        title: titles[i]!,
        owner: owners[i % owners.length]!,
        difficulty: difficulties[i % 3]!,
        tags: randomSubset(allTags, 1, 4),
        acceptanceRate: parseFloat((Math.random() * 80 + 20).toFixed(1)),
        submissions: randomInt(100, 50000),
        timeLimit: [500, 1000, 2000, 3000, 5000][randomInt(0, 4)]!,
        memoryLimit: [64, 128, 256, 512, 1024][randomInt(0, 4)]!,
        createTime,
        lastModifiedTime,
        accessLevel: accessLevels[i % 3]!,
        description: `这是题目「${titles[i]}」的详细描述。需要在规定时间和内存限制内完成算法实现。`,
      });
    }
  }

  async queryProblems(
    params: ProblemQueryParams = {},
  ): Promise<PageResult<Problem>> {
    await delay(400);

    let filtered = [...this.problems];

    if (params.problemNumber) {
      const keyword = params.problemNumber.toLowerCase();
      filtered = filtered.filter((p) =>
        p.problemNumber.toLowerCase().includes(keyword),
      );
    }

    if (params.title) {
      const keyword = params.title.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(keyword),
      );
    }

    if (params.owner) {
      filtered = filtered.filter((p) => p.owner === params.owner);
    }

    if (params.difficulty) {
      filtered = filtered.filter((p) => p.difficulty === params.difficulty);
    }

    if (params.tags && params.tags.length > 0) {
      filtered = filtered.filter((p) =>
        params.tags!.some((tag) => p.tags.includes(tag)),
      );
    }

    if (params.accessLevel) {
      filtered = filtered.filter((p) => p.accessLevel === params.accessLevel);
    }

    if (params.createTimeFrom) {
      filtered = filtered.filter(
        (p) => new Date(p.createTime) >= params.createTimeFrom!,
      );
    }
    if (params.createTimeTo) {
      filtered = filtered.filter(
        (p) => new Date(p.createTime) <= params.createTimeTo!,
      );
    }

    if (params.sortField) {
      const order = params.sortOrder ?? 1;
      filtered.sort((a, b) => {
        const field = params.sortField!;
        const valA = a[field as keyof Problem];
        const valB = b[field as keyof Problem];

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
    }

    const total = filtered.length;

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: filtered.slice(start, end),
      total,
    };
  }

  async getProblemById(id: string): Promise<Problem | undefined> {
    await delay(200);
    return this.problems.find((p) => p.id === id);
  }

  async createProblem(
    data: Omit<
      Problem,
      'id' | 'problemNumber' | 'createTime' | 'lastModifiedTime'
    >,
  ): Promise<Problem> {
    await delay(300);

    const maxId = Math.max(
      ...this.problems.map((p) => Number(p.id) || 0),
      1000,
    );
    const newId = `${maxId + 1}`;
    const now = new Date();

    const newProblem: Problem = {
      ...data,
      id: newId,
      problemNumber: `OJ-${newId}`,
      createTime: now,
      lastModifiedTime: now,
    };

    this.problems.unshift(newProblem);
    return newProblem;
  }

  async updateProblem(id: string, data: Partial<Problem>): Promise<Problem> {
    await delay(300);

    const index = this.problems.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`题目 ${id} 不存在`);
    }

    this.problems[index] = {
      ...this.problems[index],
      ...data,
      id,
      lastModifiedTime: new Date(),
    } as Problem;

    return this.problems[index];
  }

  async deleteProblem(id: string): Promise<void> {
    await delay(200);
    this.problems = this.problems.filter((p) => p.id !== id);
  }

  async deleteProblems(ids: string[]): Promise<void> {
    await delay(300);
    this.problems = this.problems.filter((p) => !ids.includes(p.id));
  }

  getAllTags(): string[] {
    return allTags;
  }

  getDifficultyOptions(): { label: string; value: string }[] {
    return [
      { label: '简单', value: 'Easy' },
      { label: '中等', value: 'Medium' },
      { label: '困难', value: 'Hard' },
    ];
  }

  getAccessLevelOptions(): { label: string; value: string }[] {
    return [
      { label: '公开', value: 'Public' },
      { label: '私有', value: 'Private' },
      { label: '共享', value: 'Shared' },
    ];
  }

  getOwnerOptions(): { label: string; value: string }[] {
    return owners.map((o) => ({ label: o, value: o }));
  }

  getProblemsForExport(): Problem[] {
    return [...this.problems];
  }
}
