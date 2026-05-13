import { fakerZH_CN as faker } from '@faker-js/faker';

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

const ALL_TAGS = [
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

const TITLE_PREFIXES = [
  '两数之和',
  '最长子串',
  '中位数查找',
  '回文串',
  '字形变换',
  '整数反转',
  '字符串转换',
  '正则匹配',
  '盛水容器',
  '数字转罗马',
  '三数之和',
  '四数之和',
  '括号生成',
  '链表合并',
  '螺旋矩阵',
  '跳跃游戏',
  '全排列',
  '旋转图像',
  '字母分组',
  'N皇后',
  '最大子数组',
  '合并区间',
  '最后一个单词',
  '不同路径',
];

const DIFFICULTIES: Problem['difficulty'][] = ['Easy', 'Medium', 'Hard'];

faker.seed(2026);

export function generateProblems(count = 60): Problem[] {
  return Array.from({ length: count }, (_, i) => {
    const createTime = faker.date.past({ years: 1 });
    const lastModified = faker.date.between({
      from: createTime,
      to: new Date(),
    });

    return {
      id: faker.string.uuid(),
      problemNumber: `OJ-${String(1001 + i)}`,
      title: `${faker.helpers.arrayElement(TITLE_PREFIXES)} ${faker.number.int({ min: 1, max: 999 })}`,
      owner: faker.person.fullName(),
      difficulty: faker.helpers.arrayElement(DIFFICULTIES),
      tags: faker.helpers.arrayElements(ALL_TAGS, { min: 1, max: 4 }),
      acceptanceRate: faker.number.float({
        min: 20,
        max: 100,
        fractionDigits: 1,
      }),
      submissions: faker.number.int({ min: 100, max: 50000 }),
      timeLimit: faker.helpers.arrayElement([500, 1000, 2000, 3000, 5000]),
      memoryLimit: faker.helpers.arrayElement([64, 128, 256, 512, 1024]),
      createTime: createTime.toISOString(),
      lastModifiedTime: lastModified.toISOString(),
      accessLevel: faker.helpers.arrayElement(['Public', 'Private', 'Shared']),
      description: faker.lorem.paragraph({ min: 2, max: 5 }),
    };
  });
}
