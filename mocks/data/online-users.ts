import { fakerZH_CN as faker } from '@faker-js/faker';

const USER_POOL = [
  'admin',
  'zhangsan',
  'lisi',
  'wangwu',
  'zhaoliu',
  'sunqi',
  'zhouba',
  'wujiu',
  'zhengshi',
  'chenxia',
  'liuyang',
  'huangfei',
  'xulin',
  'gaopeng',
  'guowei',
];

export interface OnlineUser {
  token: string;
  userName: string;
  deptName: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  loginTime: string;
  lastActivityTime: string;
  status: 'online';
}

/** 部门池，与 users.ts 中的部门数据保持一致 */
const DEPT_POOL = [
  '技术部',
  '产品部',
  '设计部',
  '市场部',
  '销售部',
  '人事部',
  '财务部',
  '行政部',
  '前端组',
  '后端组',
];

/** 浏览器池 */
const BROWSERS = [
  'Chrome 125',
  'Chrome 124',
  'Chrome 123',
  'Edge 125',
  'Edge 124',
  'Firefox 127',
  'Firefox 126',
  'Safari 17.5',
  'Safari 17.4',
];

/** 操作系统池 */
const OS_LIST = [
  'Windows 11',
  'Windows 10',
  'macOS 14.5',
  'macOS 14.4',
  'macOS 13.6',
  'Ubuntu 24.04',
  'iOS 17.5',
  'Android 14',
];

/** 地点池 */
const LOCATIONS = [
  '中国北京',
  '中国上海',
  '中国广州',
  '中国深圳',
  '中国杭州',
  '中国成都',
  '中国武汉',
  '中国南京',
  '美国洛杉矶',
  '日本东京',
  '新加坡',
  '中国香港',
];

faker.seed(2026);

export function generateOnlineUsers(count = 35): OnlineUser[] {
  return Array.from({ length: count }, (_, i) => {
    const loginTime = faker.date.recent({ days: 7 }).toISOString();
    const lastActivityTime = faker.date
      .recent({ days: 1, refDate: new Date() })
      .toISOString();

    return {
      token: faker.string.uuid(),
      userName: faker.helpers.arrayElement(USER_POOL),
      deptName: faker.helpers.arrayElement(DEPT_POOL),
      ipAddress: faker.internet.ipv4(),
      location: faker.helpers.arrayElement(LOCATIONS),
      browser: faker.helpers.arrayElement(BROWSERS),
      os: faker.helpers.arrayElement(OS_LIST),
      loginTime,
      lastActivityTime,
      status: 'online' as const,
    };
  }).sort(
    (a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime(),
  );
}
