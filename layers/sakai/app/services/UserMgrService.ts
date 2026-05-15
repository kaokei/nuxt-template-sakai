import type { User } from '@sakai/services/UserService';
import { UserService } from '@sakai/services/UserService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

@Injectable()
export class UserMgrService {
  @Inject(UserService)
  private userService!: UserService;

  // ==================== 表格数据状态 ====================
  users: User[] = [];
  totalRecords = 0;
  loading = false;
  selectedUsers: User[] = [];

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'createTime';
  sortOrder: number = -1;
  searchParams: Record<string, any> = {};

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: User | null = null;
  deleteDialogVisible = false;
  deleteMode: 'single' | 'batch' = 'single';
  deleteTarget: User | null = null;

  // ==================== 显示映射 ====================
  readonly statusLabels: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
  };
  readonly genderLabels: Record<string, string> = {
    male: '男',
    female: '女',
    other: '其他',
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

  async loadUsers(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.userService.queryUsers({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.users = result.data;
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
    this.loadUsers();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadUsers();
  }

  // ==================== 分页与排序 ====================

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadUsers();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadUsers();
  }

  // ==================== 表单弹窗操作 ====================

  @autobind
  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(user: User): void {
    this.editData = { ...user };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadUsers();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  @autobind
  confirmDelete(user: User): void {
    this.deleteMode = 'single';
    this.deleteTarget = user;
    this.deleteDialogVisible = true;
  }

  @autobind
  confirmBatchDelete(): void {
    if (!this.selectedUsers || this.selectedUsers.length === 0) return;
    this.deleteMode = 'batch';
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteMode === 'single' && this.deleteTarget) {
      await this.userService.deleteUser(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadUsers();
      return { success: true, message: '用户已删除' };
    }

    const ids = (this.selectedUsers || []).map((u) => u.id);
    await this.userService.deleteUsers(ids);
    this.selectedUsers = [];
    this.deleteDialogVisible = false;
    this.loadUsers();
    return { success: true, message: `已删除 ${ids.length} 个用户` };
  }
}
