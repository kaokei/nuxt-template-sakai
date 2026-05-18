import { fakerZH_CN as faker } from '@faker-js/faker';

export interface OperLog {
  id: string;
  userName: string;
  operationTime: string;
  module: string;
  operationType: string;
  title: string;
  requestMethod: string;
  requestUrl: string;
  requestParams: string;
  responseResult: string;
  ipAddress: string;
  location: string;
  status: 'success' | 'fail';
  duration: number;
  errorMsg: string;
}

/** 用户名池，与登录日志保持一致 */
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

/** 操作模块 */
const MODULES = [
  '用户管理',
  '角色管理',
  '菜单管理',
  '部门管理',
  '岗位管理',
  '字典管理',
  '参数配置',
  '功能开关',
  '定时任务',
  '数据备份',
  '通知管理',
  '登录日志',
  '操作日志',
  '在线用户',
];

/** 操作类型 */
const OPERATION_TYPES = [
  '新增',
  '修改',
  '删除',
  '查询',
  '导出',
  '导入',
  '授权',
  '登录',
  '登出',
];

/** 请求方式 */
const REQUEST_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

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

/** 成功时的响应模板 */
function successResponse(title: string): string {
  return JSON.stringify({
    code: 200,
    message: '操作成功',
    data: `${title}处理完成`,
  });
}

/** 失败时的错误信息 */
const ERROR_MESSAGES = [
  '权限不足，无法执行此操作',
  '数据不存在或已被删除',
  '参数校验失败：缺少必填字段',
  '数据库连接超时',
  '重复数据，违反唯一约束',
  '操作频率过高，请稍后重试',
  '关联数据未清理，无法删除',
];

faker.seed(2026);

export function generateOperLogs(count = 100): OperLog[] {
  return Array.from({ length: count }, (_, i) => {
    const module = faker.helpers.arrayElement(MODULES);
    const operationType = faker.helpers.arrayElement(OPERATION_TYPES);
    const requestMethod = faker.helpers.arrayElement(REQUEST_METHODS);
    const status = faker.helpers.weightedArrayElement([
      { weight: 90, value: 'success' as const },
      { weight: 10, value: 'fail' as const },
    ]);
    const title = `${operationType}${module}${faker.number.int({ min: 100, max: 999 })}`;
    const operationTime = faker.date.recent({ days: 30 }).toISOString();

    return {
      id: `oper-${String(i + 1).padStart(4, '0')}`,
      userName: faker.helpers.arrayElement(USER_POOL),
      operationTime,
      module,
      operationType,
      title,
      requestMethod,
      requestUrl: `/api/${module.toLowerCase().replace(/[^\w]/g, '-')}/${faker.number.int({ min: 1, max: 100 })}`,
      requestParams: JSON.stringify({
        id: faker.number.int({ min: 1, max: 999 }),
        name: `${module}数据`,
        page: 1,
        pageSize: 10,
      }),
      responseResult:
        status === 'success'
          ? successResponse(title)
          : JSON.stringify({ code: 500, message: '操作失败' }),
      ipAddress: faker.internet.ipv4(),
      location: faker.helpers.arrayElement(LOCATIONS),
      status,
      duration: faker.number.int({
        min: 10,
        max: status === 'fail' ? 30000 : 3000,
      }),
      errorMsg:
        status === 'fail' ? faker.helpers.arrayElement(ERROR_MESSAGES) : '',
    };
  }).sort(
    (a, b) =>
      new Date(b.operationTime).getTime() - new Date(a.operationTime).getTime(),
  );
}
