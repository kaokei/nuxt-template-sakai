import { BaseMockService } from '~/services/mock/base-mock.service';
import {
  randomChoice,
  randomDate,
  randomInt,
  randomSubset,
} from '~/services/mock/mock-utils';

/**
 * 题目数据模型
 */
export interface MockProblem {
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

const TITLES = [
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

const OWNERS = [
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

const DIFFICULTIES: MockProblem['difficulty'][] = ['Easy', 'Medium', 'Hard'];
const ACCESS_LEVELS: MockProblem['accessLevel'][] = [
  'Public',
  'Private',
  'Shared',
];
const TIME_LIMITS = [500, 1000, 2000, 3000, 5000];
const MEMORY_LIMITS = [64, 128, 256, 512, 1024];

function generateMockProblems(count = 60): MockProblem[] {
  const problems: MockProblem[] = [];

  for (let i = 0; i < count; i++) {
    const id = `${1001 + i}`;
    const createTime = randomDate(365);
    let lastModifiedTime = randomDate(30);

    if (lastModifiedTime < createTime) {
      lastModifiedTime = new Date(
        createTime.getTime() + Math.random() * 30 * 86400000,
      );
    }

    problems.push({
      id,
      problemNumber: `OJ-${id}`,
      title: TITLES[i % TITLES.length]!,
      owner: OWNERS[i % OWNERS.length]!,
      difficulty: DIFFICULTIES[i % 3]!,
      tags: randomSubset(ALL_TAGS, 1, 4),
      acceptanceRate: parseFloat((Math.random() * 80 + 20).toFixed(1)),
      submissions: randomInt(100, 50000),
      timeLimit: randomChoice(TIME_LIMITS),
      memoryLimit: randomChoice(MEMORY_LIMITS),
      createTime,
      lastModifiedTime,
      accessLevel: ACCESS_LEVELS[i % 3]!,
      description: `这是题目「${TITLES[i % TITLES.length]}」的详细描述。需要在规定时间和内存限制内完成算法实现。`,
    });
  }

  return problems;
}

@Injectable()
export class ProblemMockService extends BaseMockService<MockProblem> {
  constructor() {
    super();
    this.initData(generateMockProblems(60));
  }
}
