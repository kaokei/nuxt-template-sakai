import {
  type LoginLog,
  LoginLogService,
} from '@sakai/services/LoginLogService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

@Injectable()
export class LoginLogMgrService {
  @Inject(LoginLogService)
  private loginLogService!: LoginLogService;

  // ==================== 表格数据状态 ====================
  logs: LoginLog[] = [];
  totalRecords = 0;
  loading = false;

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'loginTime';
  sortOrder: number = -1;
  searchParams: Record<string, any> = {};

  // ==================== 详情弹窗状态 ====================
  detailDialogVisible = false;
  detailData: LoginLog | null = null;

  // ==================== 状态映射 ====================
  readonly statusLabels: Record<string, string> = {
    success: '成功',
    fail: '失败',
  };

  getStatusSeverity(status: string): 'success' | 'danger' {
    return status === 'success' ? 'success' : 'danger';
  }

  formatDateTime(date: string): string {
    if (!date) return '--';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const sec = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}:${sec}`;
  }

  // ==================== 数据加载 ====================
  async loadLogs(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.loginLogService.queryLogs({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.logs = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 搜索与重置 ====================
  @autobind
  onSearch(params: Record<string, any>): void {
    this.searchParams = params;
    this.page = 1;
    this.loadLogs();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadLogs();
  }

  // ==================== 分页与排序 ====================
  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadLogs();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadLogs();
  }

  // ==================== 查看详情 ====================
  @autobind
  async viewDetail(log: LoginLog): Promise<void> {
    const detail = await this.loginLogService.getLogById(log.id);
    if (detail) {
      this.detailData = detail;
      this.detailDialogVisible = true;
    }
  }
}
