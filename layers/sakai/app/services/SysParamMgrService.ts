import { SysParamService } from '@sakai/services/SysParamService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import type { SysParam } from '~/types/sys-param';

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

@Injectable()
export class SysParamMgrService {
  @Inject(SysParamService)
  private sysParamService!: SysParamService;

  // ==================== 表格数据状态 ====================
  params: SysParam[] = [];
  totalRecords = 0;
  loading = false;
  selectedParams: SysParam[] = [];

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'sort';
  sortOrder: number = 1;
  searchParams: Record<string, any> = {};

  // ==================== 搜索字段 ====================
  searchName = '';
  searchKey = '';
  searchType: string | undefined = undefined;

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: SysParam | null = null;
  deleteDialogVisible = false;
  deleteMode: 'single' | 'batch' = 'single';
  deleteTarget: SysParam | null = null;

  // ==================== 显示映射 ====================
  readonly statusLabels: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
  };

  readonly typeLabels: Record<string, string> = {
    string: '字符串',
    number: '数字',
    boolean: '布尔值',
    json: 'JSON',
  };

  // ==================== 工具函数 ====================

  getStatusSeverity(status: string): 'success' | 'danger' {
    const map: Record<string, 'success' | 'danger'> = {
      active: 'success',
      inactive: 'danger',
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

  async loadParams(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.sysParamService.getList({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.params = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 搜索与重置 ====================

  @autobind
  search(): void {
    const params: Record<string, any> = {};
    if (this.searchName) {
      params.name = this.searchName;
    }
    if (this.searchKey) {
      params.key = this.searchKey;
    }
    if (this.searchType) {
      params.type = this.searchType;
    }
    this.searchParams = params;
    this.page = 1;
    this.loadParams();
  }

  @autobind
  onReset(): void {
    this.searchName = '';
    this.searchKey = '';
    this.searchType = undefined;
    this.searchParams = {};
    this.page = 1;
    this.loadParams();
  }

  // ==================== 分页与排序 ====================

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadParams();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadParams();
  }

  // ==================== 表单弹窗操作 ====================

  @autobind
  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(param: SysParam): void {
    this.editData = { ...param };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadParams();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  @autobind
  confirmDelete(param: SysParam): void {
    this.deleteMode = 'single';
    this.deleteTarget = param;
    this.deleteDialogVisible = true;
  }

  @autobind
  confirmBatchDelete(): void {
    if (!this.selectedParams || this.selectedParams.length === 0) return;
    this.deleteMode = 'batch';
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteMode === 'single' && this.deleteTarget) {
      await this.sysParamService.delete(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadParams();
      return { success: true, message: '参数已删除' };
    }

    // 批量删除
    const ids = (this.selectedParams || []).map((p) => p.id);
    for (const id of ids) {
      await this.sysParamService.delete(id);
    }
    this.selectedParams = [];
    this.deleteDialogVisible = false;
    this.loadParams();
    return { success: true, message: `已删除 ${ids.length} 个参数` };
  }

  @autobind
  async save(data: Omit<SysParam, 'id' | 'createTime'>): Promise<SaveResult> {
    const isEdit = !!this.editData;
    if (isEdit && this.editData) {
      await this.sysParamService.update(this.editData.id, data);
    } else {
      await this.sysParamService.create(data);
    }
    this.loadParams();
    return { success: true, isEdit };
  }

  @autobind
  async deleteParam(id: string): Promise<DeleteResult> {
    await this.sysParamService.delete(id);
    this.loadParams();
    return { success: true, message: '参数已删除' };
  }
}
