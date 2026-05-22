import { fakerZH_CN as faker } from '@faker-js/faker';

faker.seed(2026);

const CACHE_NAMES = [
  'sys_config',
  'sys_dict',
  'sys_dept',
  'sys_menu',
  'sys_role',
  'sys_user',
  'sys_post',
  'sys_notice',
  'login_tokens',
  'captcha_codes',
  'session_keys',
  'rate_limit',
  'api_cache',
  'page_cache',
  'query_cache',
  'user_permissions',
  'role_permissions',
  'dept_tree',
  'menu_tree',
  'dict_type',
];

const CACHE_TYPES = ['string', 'hash', 'list', 'set', 'zset'];

export function generateCacheItems(count = 50) {
  return Array.from({ length: count }, (_, i) => {
    const type = faker.helpers.arrayElement(CACHE_TYPES);
    const keyCount =
      type === 'string' ? 1 : faker.number.int({ min: 5, max: 500 });
    const ttl = faker.helpers.arrayElement([
      -1, 300, 600, 1800, 3600, 7200, 86400, 604800,
    ]);

    return {
      cacheName:
        i < CACHE_NAMES.length
          ? CACHE_NAMES[i]!
          : `${faker.helpers.arrayElement(CACHE_NAMES)}_${faker.string.alphanumeric(4)}`,
      keyCount,
      ttl: ttl === -1 ? '永不过期' : formatTTL(ttl),
      size: formatSize(faker.number.int({ min: 1024, max: 50 * 1024 * 1024 })),
      type,
      remark: faker.helpers.arrayElement([
        '系统配置缓存',
        '字典数据缓存',
        '部门树缓存',
        '菜单树缓存',
        '角色数据缓存',
        '用户数据缓存',
        '岗位数据缓存',
        '通知公告缓存',
        '登录令牌缓存',
        '验证码缓存',
        '会话缓存',
        '接口限流缓存',
        'API 响应缓存',
        '页面缓存',
        '查询结果缓存',
        '用户权限缓存',
        '角色权限缓存',
        '部门树缓存',
        '菜单树缓存',
        '字典类型缓存',
      ]),
      createTime: faker.date.recent({ days: 90 }).toISOString(),
    };
  }).sort(
    (a, b) =>
      new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
  );
}

function formatTTL(seconds: number): string {
  if (seconds < 60) return `${seconds} 秒`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时`;
  return `${Math.floor(seconds / 86400)} 天`;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
