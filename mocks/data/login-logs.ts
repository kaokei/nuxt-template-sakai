import { fakerZH_CN as faker } from '@faker-js/faker';

export interface LoginLog {
  id: string;
  userName: string;
  loginTime: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  status: 'success' | 'fail';
  message: string;
}

/** 预定义用户池，保持登录日志中用户名的一致性 */
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

/** 登录失败原因 */
const FAIL_MESSAGES = [
  '密码错误',
  '账号已被锁定',
  '账号已禁用',
  '验证码错误',
  '登录次数超限',
  'IP 不在白名单',
  '异地登录需验证',
];

faker.seed(2026);

export function generateLoginLogs(count = 80): LoginLog[] {
  return Array.from({ length: count }, (_, i) => {
    const status = faker.helpers.weightedArrayElement([
      { weight: 85, value: 'success' as const },
      { weight: 15, value: 'fail' as const },
    ]);
    // 让时间从最近往前推，使新旧记录分布合理
    const loginTime = faker.date.recent({ days: 30 }).toISOString();

    return {
      id: `login-${String(i + 1).padStart(4, '0')}`,
      userName: faker.helpers.arrayElement(USER_POOL),
      loginTime,
      ipAddress: faker.internet.ipv4(),
      location: faker.helpers.arrayElement(LOCATIONS),
      browser: faker.helpers.arrayElement(BROWSERS),
      os: faker.helpers.arrayElement(OS_LIST),
      status,
      message:
        status === 'success'
          ? '登录成功'
          : faker.helpers.arrayElement(FAIL_MESSAGES),
    };
  }).sort(
    // 按登录时间倒序排列（最新在前）
    (a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime(),
  );
}
