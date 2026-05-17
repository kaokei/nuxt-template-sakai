/** 数据备份 */
export interface Backup {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  type: 'full' | 'incremental';
  status: 'success' | 'failed' | 'running';
  createTime: string;
  remark: string;
}
