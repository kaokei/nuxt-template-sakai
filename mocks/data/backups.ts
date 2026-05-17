export interface Backup {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  type: 'full' | 'incremental';
  status: 'success' | 'failed' | 'running';
  createTime: string;
  remark: string;
}

export const BACKUP_LIST: Backup[] = [
  {
    id: 'backup-001',
    name: '全量备份-20260517',
    fileName: 'backup_full_20260517_020000.zip',
    fileSize: 2147483648,
    type: 'full',
    status: 'success',
    createTime: '2026-05-17T02:00:00.000Z',
    remark: '每日全量备份',
  },
  {
    id: 'backup-002',
    name: '增量备份-20260517-am',
    fileName: 'backup_incr_20260517_080000.zip',
    fileSize: 536870912,
    type: 'incremental',
    status: 'success',
    createTime: '2026-05-17T08:00:00.000Z',
    remark: '上午增量备份',
  },
  {
    id: 'backup-003',
    name: '全量备份-20260516',
    fileName: 'backup_full_20260516_020000.zip',
    fileSize: 2072570060,
    type: 'full',
    status: 'success',
    createTime: '2026-05-16T02:00:00.000Z',
    remark: '每日全量备份',
  },
  {
    id: 'backup-004',
    name: '增量备份-20260516-am',
    fileName: 'backup_incr_20260516_080000.zip',
    fileSize: 489856000,
    type: 'incremental',
    status: 'failed',
    createTime: '2026-05-16T08:00:00.000Z',
    remark: '上午增量备份-磁盘空间不足',
  },
  {
    id: 'backup-005',
    name: '全量备份-20260515',
    fileName: 'backup_full_20260515_020000.zip',
    fileSize: 2058636288,
    type: 'full',
    status: 'success',
    createTime: '2026-05-15T02:00:00.000Z',
    remark: '每日全量备份',
  },
  {
    id: 'backup-006',
    name: '增量备份-20260515-am',
    fileName: 'backup_incr_20260515_080000.zip',
    fileSize: 524288000,
    type: 'incremental',
    status: 'success',
    createTime: '2026-05-15T08:00:00.000Z',
    remark: '上午增量备份',
  },
  {
    id: 'backup-007',
    name: '全量备份-20260514',
    fileName: 'backup_full_20260514_020000.zip',
    fileSize: 2038439936,
    type: 'full',
    status: 'success',
    createTime: '2026-05-14T02:00:00.000Z',
    remark: '每日全量备份',
  },
  {
    id: 'backup-008',
    name: '手动备份-用户数据',
    fileName: 'backup_manual_user_20260510_143000.zip',
    fileSize: 1073741824,
    type: 'full',
    status: 'running',
    createTime: '2026-05-10T14:30:00.000Z',
    remark: '手动触发用户数据备份',
  },
];
