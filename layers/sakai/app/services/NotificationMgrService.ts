import { NotificationService } from '@sakai/services/NotificationService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import type { NotificationRecord } from '~/types/notification';

@Injectable()
export class NotificationMgrService {
  @Inject(NotificationService)
  notificationService!: NotificationService;

  records: NotificationRecord[] = [];
  totalRecords = 0;
  loading = false;

  page = 1;
  pageSize = 10;
  sortField = 'createdAt';
  sortOrder = '-1';
  searchParams: Record<string, any> = {};

  detailDialogVisible = false;
  currentDetail: NotificationRecord | null = null;

  formDialogVisible = false;

  readonly typeLabels: Record<string, string> = {
    announcement: '公告',
    system: '系统',
    business: '业务',
  };

  readonly statusLabels: Record<string, string> = {
    pending: '待发送',
    sent: '已发送',
    failed: '失败',
  };

  getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      announcement: 'success',
      system: 'info',
      business: 'warn',
    };
    return map[type] || 'info';
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'warn' | 'danger'> = {
      sent: 'success',
      pending: 'warn',
      failed: 'danger',
    };
    return map[status] || 'warn';
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

  async loadRecords(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.notificationService.queryRecords({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.records = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  @autobind
  onSearch(params: Record<string, any>): void {
    this.searchParams = params;
    this.page = 1;
    this.loadRecords();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadRecords();
  }

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadRecords();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder !== null ? String(event.sortOrder) : '1';
    this.loadRecords();
  }

  @autobind
  openNew(): void {
    this.formDialogVisible = true;
  }

  @autobind
  onSaved(): { success: boolean } {
    this.formDialogVisible = false;
    this.loadRecords();
    return { success: true };
  }

  @autobind
  showDetail(record: NotificationRecord): void {
    this.currentDetail = record;
    this.detailDialogVisible = true;
  }

  async retrySend(id: string): Promise<void> {
    await this.notificationService.retryRecord(id);
    this.loadRecords();
  }
}
