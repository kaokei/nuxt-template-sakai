import type { Role } from '@sakai/services/RoleService';
import { RoleService } from '@sakai/services/RoleService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

@Injectable()
export class RoleMgrService {
  @Inject(RoleService)
  private roleService!: RoleService;

  // ==================== 表格数据状态 ====================
  roles: Role[] = [];
  totalRecords = 0;
  loading = false;
  selectedRoles: Role[] = [];

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'order';
  sortOrder: number = 1;
  searchParams: Record<string, any> = {};

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: Role | null = null;
  deleteDialogVisible = false;
  deleteMode: 'single' | 'batch' = 'single';
  deleteTarget: Role | null = null;

  // ==================== 显示映射 ====================
  readonly dataScopeLabels: Record<string, string> = {
    all: '全部',
    deptAndBelow: '本部门及以下',
    dept: '本部门',
    self: '仅本人',
    custom: '自定义',
  };

  readonly statusLabels: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
  };

  // ==================== 工具函数 ====================

  getDataScopeSeverity(scope: string): 'success' | 'info' | 'warn' | 'danger' {
    const map: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      all: 'success',
      deptAndBelow: 'info',
      dept: 'warn',
      self: 'danger',
      custom: 'info',
    };
    return map[scope] || 'info';
  }

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

  async loadRoles(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.roleService.queryRoles({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.roles = result.data;
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
    this.loadRoles();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadRoles();
  }

  // ==================== 分页与排序 ====================

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadRoles();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadRoles();
  }

  // ==================== 表单弹窗操作 ====================

  @autobind
  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(role: Role): void {
    this.editData = { ...role };
    this.formDialogVisible = true;
  }

  onSaved(): { success: true; isEdit: boolean } {
    const isEdit = !!this.editData;
    this.loadRoles();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  @autobind
  confirmDelete(role: Role): void {
    this.deleteMode = 'single';
    this.deleteTarget = role;
    this.deleteDialogVisible = true;
  }

  @autobind
  confirmBatchDelete(): void {
    if (!this.selectedRoles || this.selectedRoles.length === 0) return;
    this.deleteMode = 'batch';
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<{ success: true; message: string }> {
    if (this.deleteMode === 'single' && this.deleteTarget) {
      await this.roleService.deleteRole(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadRoles();
      return { success: true, message: '角色已删除' };
    }

    const ids = (this.selectedRoles || []).map((r) => r.id);
    await this.roleService.deleteRoles(ids);
    this.selectedRoles = [];
    this.deleteDialogVisible = false;
    this.loadRoles();
    return { success: true, message: `已删除 ${ids.length} 个角色` };
  }
}
