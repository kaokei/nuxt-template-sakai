export interface Job {
  id: string;
  name: string;
  group: string;
  cron: string;
  className: string;
  methodName: string;
  params: string;
  status: 'running' | 'paused';
  lastRunTime: string | null;
  nextRunTime: string;
  createTime: string;
  remark: string;
}

export const JOB_LIST: Job[] = [
  {
    id: 'job-001',
    name: '数据备份任务',
    group: '系统',
    cron: '0 0 2 * * ?',
    className: 'com.sakai.task.BackupTask',
    methodName: 'executeBackup',
    params: '{"type":"full"}',
    status: 'running',
    lastRunTime: '2026-05-17T02:00:00.000Z',
    nextRunTime: '2026-05-18T02:00:00.000Z',
    createTime: '2024-01-15T08:00:00.000Z',
    remark: '每日凌晨2点执行全量数据备份',
  },
  {
    id: 'job-002',
    name: '日志清理任务',
    group: '系统',
    cron: '0 0 3 * * ?',
    className: 'com.sakai.task.LogCleanTask',
    methodName: 'cleanLogs',
    params: '{"retentionDays":90}',
    status: 'running',
    lastRunTime: '2026-05-17T03:00:00.000Z',
    nextRunTime: '2026-05-18T03:00:00.000Z',
    createTime: '2024-02-20T09:30:00.000Z',
    remark: '每日凌晨3点清理超期日志文件',
  },
  {
    id: 'job-003',
    name: '缓存刷新任务',
    group: '系统',
    cron: '0 */30 * * * ?',
    className: 'com.sakai.task.CacheRefreshTask',
    methodName: 'refreshCache',
    params: '{"cacheNames":["user","permission","dict"]}',
    status: 'running',
    lastRunTime: '2026-05-17T10:30:00.000Z',
    nextRunTime: '2026-05-17T11:00:00.000Z',
    createTime: '2024-03-10T10:00:00.000Z',
    remark: '每30分钟刷新热点缓存数据',
  },
  {
    id: 'job-004',
    name: '临时文件清理',
    group: '系统',
    cron: '0 0 4 * * ?',
    className: 'com.sakai.task.TempFileCleanTask',
    methodName: 'cleanTempFiles',
    params: '{"maxAgeHours":24}',
    status: 'paused',
    lastRunTime: '2026-05-10T04:00:00.000Z',
    nextRunTime: '2026-05-18T04:00:00.000Z',
    createTime: '2024-04-05T14:00:00.000Z',
    remark: '每日凌晨4点清理临时上传文件(已暂停)',
  },
  {
    id: 'job-005',
    name: '数据库优化任务',
    group: '系统',
    cron: '0 0 5 * * ?',
    className: 'com.sakai.task.DatabaseOptimizeTask',
    methodName: 'optimizeTables',
    params: '{"tables":["sys_user","sys_log"]}',
    status: 'running',
    lastRunTime: '2026-05-17T05:00:00.000Z',
    nextRunTime: '2026-05-18T05:00:00.000Z',
    createTime: '2024-05-18T08:15:00.000Z',
    remark: '每日凌晨5点执行数据库表优化',
  },
];
