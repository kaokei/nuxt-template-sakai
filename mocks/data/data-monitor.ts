import { fakerZH_CN as faker } from '@faker-js/faker';

faker.seed(2026);

export function generateDataMonitor() {
  const activeCount = faker.number.int({ min: 5, max: 30 });
  const maxActive = faker.number.int({ min: 50, max: 100 });

  const sqlList = Array.from({ length: 35 })
    .map(() => {
      return {
        sql: faker.helpers.arrayElement([
          'SELECT * FROM sys_user WHERE user_id = ?',
          'SELECT * FROM sys_role WHERE role_id = ?',
          'SELECT u.*, r.role_name FROM sys_user u LEFT JOIN sys_user_role ur ON u.user_id = ur.user_id LEFT JOIN sys_role r ON ur.role_id = r.role_id',
          'UPDATE sys_user SET login_date = ?, login_ip = ? WHERE user_id = ?',
          'INSERT INTO sys_oper_log (title, business_type, method, oper_name, oper_time) VALUES (?, ?, ?, ?, ?)',
          'SELECT * FROM sys_menu WHERE visible = ? ORDER BY order_num',
          'SELECT COUNT(*) FROM sys_logininfor WHERE user_name = ? AND status = ?',
          'SELECT * FROM sys_config WHERE config_key = ?',
          'SELECT * FROM sys_dept WHERE parent_id = ? ORDER BY order_num',
          'DELETE FROM sys_user_role WHERE user_id = ?',
          'SELECT * FROM sys_dict_data WHERE dict_type = ? ORDER BY dict_sort',
          'SELECT * FROM sys_post ORDER BY post_sort',
          'SELECT * FROM sys_notice WHERE notice_type = ? AND status = ?',
          'SELECT * FROM sys_job WHERE status = ? ORDER BY create_time DESC',
          'UPDATE sys_role SET data_scope = ?, role_sort = ? WHERE role_id = ?',
        ]),
        executeCount: faker.number.int({ min: 100, max: 50000 }),
        avgTime: faker.number.float({ min: 0.5, max: 500, fractionDigits: 1 }),
        maxTime: faker.number.float({ min: 10, max: 2000, fractionDigits: 1 }),
        errorCount: faker.number.int({ min: 0, max: 20 }),
        slowCount: faker.number.int({ min: 0, max: 50 }),
        lastExecuteTime: faker.date.recent({ days: 1 }).toISOString(),
      };
    })
    .sort((a, b) => b.avgTime - a.avgTime);

  const uriList = Array.from({ length: 25 })
    .map(() => {
      return {
        uri: faker.helpers.arrayElement([
          '/api/system/user/list',
          '/api/system/user/',
          '/api/system/role/list',
          '/api/system/menu/list',
          '/api/system/dept/list',
          '/api/system/post/list',
          '/api/system/dict/data/list',
          '/api/system/config/list',
          '/api/monitor/online/list',
          '/api/monitor/operlog/list',
          '/api/monitor/logininfor/list',
          '/api/system/notice/list',
          '/api/system/user/export',
          '/api/system/role/export',
          '/api/login',
          '/api/captcha',
          '/api/getInfo',
          '/api/getRouters',
          '/api/system/user/profile',
          '/api/system/user/avatar',
        ]),
        requestCount: faker.number.int({ min: 50, max: 30000 }),
        avgTime: faker.number.float({ min: 1, max: 800, fractionDigits: 1 }),
        maxTime: faker.number.float({ min: 20, max: 5000, fractionDigits: 1 }),
        lastRequestTime: faker.date.recent({ days: 1 }).toISOString(),
      };
    })
    .sort((a, b) => b.avgTime - a.avgTime);

  return {
    poolStats: {
      activeCount,
      maxActive,
      waitCount: faker.number.int({ min: 0, max: 5 }),
      poolingPeak: faker.number.int({ min: maxActive - 10, max: maxActive }),
      initialSize: faker.number.int({ min: 5, max: 10 }),
      minIdle: faker.number.int({ min: 3, max: 8 }),
    },
    sqlStats: {
      executeCount: sqlList.reduce((sum, s) => sum + s.executeCount, 0),
      slowCount: sqlList.reduce((sum, s) => sum + s.slowCount, 0),
      errorCount: sqlList.reduce((sum, s) => sum + s.errorCount, 0),
      avgTime: faker.number.float({ min: 5, max: 50, fractionDigits: 1 }),
    },
    sqlList,
    uriList,
  };
}
