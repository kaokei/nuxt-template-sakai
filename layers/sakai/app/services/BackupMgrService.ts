import { BackupService } from '@sakai/services/BackupService';
import type { Backup } from '~/types/backup';

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

@Injectable()
export class BackupMgrService {
  @Inject(BackupService)
  private backupService!: BackupService;

  // ==================== 表格数据状态 ====================
  backups: Backup[] = [];
  totalRecords = 0;
  loading = false;

  // ==================== 搜索参数 ====================
  searchName = '';
  searchStatus = '';
  searchType = '';

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: Partial<Backup> | null = null;
  deleteDialogVisible = false;
  deleteTarget: Backup | null = null;

  // ==================== 显示映射 ====================
  readonly statusLabels: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '进行中',
  };

  readonly typeLabels: Record<string, string> = {
    full: '全量备份',
    incremental: '增量备份',
  };

  // ==================== 工具函数 ====================

  getStatusSeverity(status: string): 'success' | 'danger' | 'warn' {
    const map: Record<string, 'success' | 'danger' | 'warn'> = {
      success: 'success',
      failed: 'danger',
      running: 'warn',
    };
    return map[status] || 'danger';
  }

  formatDateTime(date: string): string {
    if (!date) return '--';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  }

  formatFileSize(size: string): string {
    if (!size) return '--';
    const bytes = Number(size);
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // ==================== 数据加载 ====================

  async loadBackups(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.backupService.queryBackups({});
      this.backups = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 搜索与重置 ====================

  @autobind
  onSearch(): void {
    // 搜索时重置到第一页
    this.loadBackups();
  }

  @autobind
  onReset(): void {
    this.searchName = '';
    this.searchStatus = '';
    this.searchType = '';
    this.loadBackups();
  }

  // ==================== 新建备份 ====================

  @autobind
  openCreate(): void {
    this.editData = {
      name: '',
      type: 'full',
      remark: '',
    };
    this.formDialogVisible = true;
  }

  @autobind
  async createBackup(data: Partial<Backup>): Promise<SaveResult> {
    await this.backupService.createBackup(data);
    await this.loadBackups();
    this.formDialogVisible = false;
    this.editData = null;
    return { success: true, isEdit: false };
  }

  // ==================== 删除备份 ====================

  @autobind
  openDelete(backup: Backup): void {
    this.deleteTarget = backup;
    this.deleteDialogVisible = true;
  }

  @autobind
  async confirmDelete(): Promise<DeleteResult> {
    await this.backupService.deleteBackup(this.deleteTarget!.id);
    await this.loadBackups();
    this.deleteDialogVisible = false;
    this.deleteTarget = null;
    return { success: true, message: '删除成功' };
  }

  @autobind
  cancelDelete(): void {
    this.deleteDialogVisible = false;
    this.deleteTarget = null;
  }
}
