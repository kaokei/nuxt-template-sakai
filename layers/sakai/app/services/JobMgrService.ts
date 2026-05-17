import { JobService } from '@sakai/services/JobService';
import type { Job } from '~/types/job';

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

export interface DeleteResult {
  success: true;
  message: string;
}

@Injectable()
export class JobMgrService {
  @Inject(JobService)
  private jobService!: JobService;

  // ==================== 表格数据状态 ====================
  jobs: Job[] = [];
  totalRecords = 0;
  loading = false;

  // ==================== 弹窗状态 ====================
  dialogVisible = false;
  editData: Job | null = null;
  deleteDialogVisible = false;
  deleteTarget: Job | null = null;

  // ==================== 搜索参数 ====================
  searchName = '';
  searchGroup = '';
  searchStatus: '' | 'running' | 'paused' = '';

  // ==================== 工具函数 ====================

  getStatusSeverity(status: string): 'success' | 'warning' | 'danger' {
    const map: Record<string, 'success' | 'warning' | 'danger'> = {
      running: 'success',
      paused: 'warning',
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

  // ==================== 数据加载 ====================

  async loadJobs(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.jobService.getList({
        name: this.searchName || undefined,
        group: this.searchGroup || undefined,
        status: this.searchStatus || undefined,
      });
      this.jobs = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 弹窗操作 ====================

  openNew(): void {
    this.editData = null;
    this.dialogVisible = true;
  }

  openEdit(job: Job): void {
    this.editData = { ...job };
    this.dialogVisible = true;
  }

  async save(data: Partial<Job>): Promise<SaveResult> {
    if (this.editData) {
      await this.jobService.update(this.editData.id, data);
      return { success: true, isEdit: true };
    }
    return { success: true, isEdit: false };
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadJobs();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  @autobind
  confirmDelete(job: Job): void {
    this.deleteTarget = job;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteTarget) {
      await this.jobService.deleteJob(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadJobs();
      return { success: true, message: '任务已删除' };
    }
    this.deleteDialogVisible = false;
    return { success: true, message: '' };
  }

  // ==================== 搜索与重置 ====================

  async search(): Promise<void> {
    await this.loadJobs();
  }

  @autobind
  async onReset(): Promise<void> {
    this.searchName = '';
    this.searchGroup = '';
    this.searchStatus = '';
    await this.loadJobs();
  }

  // ==================== 任务控制操作 ====================

  async executeJob(id: string): Promise<void> {
    await this.jobService.execute(id);
    await this.loadJobs();
  }

  async pauseJob(id: string): Promise<void> {
    await this.jobService.pause(id);
    await this.loadJobs();
  }

  async resumeJob(id: string): Promise<void> {
    await this.jobService.resume(id);
    await this.loadJobs();
  }
}
