import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import type { FeatureFlag } from '~/types/feature-flag';
import { FeatureFlagAdminService } from './FeatureFlagAdminService';

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

export interface DeleteResult {
  success: true;
  message: string;
}

@Injectable()
export class FeatureFlagMgrService {
  @Inject(FeatureFlagAdminService)
  public adminService!: FeatureFlagAdminService;

  // ==================== 表格数据状态 ====================
  flags: any[] = [];
  totalRecords = 0;
  loading = false;

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'createdAt';
  sortOrder: number = -1;
  searchParams: Record<string, any> = {};

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: any = null;
  deleteDialogVisible = false;
  deleteTarget: any = null;

  // ==================== 选项数据 ====================
  tagOptions: { label: string; value: string }[] = [];
  envOptions: { label: string; value: string }[] = [
    { label: '开发环境', value: 'dev' },
    { label: '预发环境', value: 'staging' },
    { label: '生产环境', value: 'prod' },
  ];
  strategyOptions: { label: string; value: string }[] = [
    { label: '关闭', value: 'off' },
    { label: '开启', value: 'on' },
    { label: '灰度发布', value: 'gradual' },
    { label: '白名单', value: 'whitelist' },
  ];

  // ==================== 数据加载 ====================

  async loadFlags(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.adminService.queryFlags({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.flags = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  async loadTagOptions(): Promise<void> {
    const tags = await this.adminService.getTagOptions();
    this.tagOptions = tags.map((t) => ({ label: t, value: t }));
  }

  // ==================== 搜索与重置 ====================

  @autobind
  onSearch(params: Record<string, any>): void {
    this.searchParams = params;
    this.page = 1;
    this.loadFlags();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadFlags();
  }

  // ==================== 分页与排序 ====================

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadFlags();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadFlags();
  }

  // ==================== 表单弹窗操作 ====================

  @autobind
  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(flag: any): void {
    this.editData = { ...flag };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadFlags();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  @autobind
  confirmDelete(flag: any): void {
    this.deleteTarget = flag;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteTarget) {
      await this.adminService.deleteFlag(this.deleteTarget.key);
      this.deleteDialogVisible = false;
      this.loadFlags();
      return { success: true, message: '已删除' };
    }
    return { success: true, message: '' };
  }

  // ==================== 显示映射 ====================

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      boolean: '布尔开关',
      multivariate: '多值变体',
    };
    return map[type] || type;
  }

  getStatusSeverity(status: string): 'success' | 'danger' {
    const map: Record<string, 'success' | 'danger'> = {
      active: 'success',
      archived: 'danger',
    };
    return map[status] || 'danger';
  }

  getStrategyLabel(strategy: string): string {
    const map: Record<string, string> = {
      on: '开启',
      off: '关闭',
      gradual: '灰度',
      whitelist: '白名单',
    };
    return map[strategy] || strategy;
  }

  getStrategySeverity(
    strategy: string,
  ): 'success' | 'danger' | 'warn' | 'info' {
    const map: Record<string, 'success' | 'danger' | 'warn' | 'info'> = {
      on: 'success',
      off: 'danger',
      gradual: 'warn',
      whitelist: 'info',
    };
    return map[strategy] || 'info';
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
}
