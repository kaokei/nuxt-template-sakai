/** 定时任务 */
export interface Job {
  id: string;
  name: string;
  group: string;
  cron: string;
  className: string;
  methodName: string;
  params: string;
  status: 'running' | 'paused';
  lastRunTime: string;
  nextRunTime: string;
  createTime: string;
  remark: string;
}
