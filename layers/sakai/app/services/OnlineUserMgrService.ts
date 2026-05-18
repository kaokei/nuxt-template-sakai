import {
  type OnlineUser,
  OnlineUserService,
} from '@sakai/services/OnlineUserService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

@Injectable()
export class OnlineUserMgrService {
  @Inject(OnlineUserService)
  private onlineUserService!: OnlineUserService;

  // ==================== 表格数据状态 ====================
  users: OnlineUser[] = [];
  totalRecords = 0;
  loading = false;

  // ==================== 选中状态 ====================
  selectedUsers: OnlineUser[] = [];

  // ==================== 分页与排序参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'loginTime';
  sortOrder: number = -1;
  searchParams: Record<string, any> = {};

  // ==================== 强退弹窗状态 ====================
  kickDialogVisible = false;
  kickTarget: OnlineUser[] = [];

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
  async loadOnlineUsers(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.onlineUserService.queryList({
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
    this.loadOnlineUsers();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadOnlineUsers();
  }

  // ==================== 分页与排序 ====================
  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadOnlineUsers();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = String(event.sortField ?? 'loginTime');
    this.sortOrder = event.sortOrder ?? -1;
    this.loadOnlineUsers();
  }

  // ==================== 强退操作 ====================

  @autobind
  confirmKickSingle(user: OnlineUser): void {
    this.kickTarget = [user];
    this.kickDialogVisible = true;
  }

  @autobind
  confirmKickBatch(): void {
    if (this.selectedUsers.length === 0) return;
    this.kickTarget = [...this.selectedUsers];
    this.kickDialogVisible = true;
  }

  @autobind
  onKickCancel(): void {
    this.kickDialogVisible = false;
    this.kickTarget = [];
  }

  async onKickConfirm(): Promise<{ success: boolean; message: string }> {
    const tokens = this.kickTarget.map((u) => u.token);
    const [singleToken] = tokens;
    try {
      const result =
        tokens.length === 1
          ? await this.onlineUserService.kickOne(singleToken!)
          : await this.onlineUserService.kickBatch(tokens);
      if (result.success) {
        this.kickDialogVisible = false;
        this.kickTarget = [];
        this.selectedUsers = [];
        await this.loadOnlineUsers();
      }
      return result;
    } catch {
      this.kickDialogVisible = false;
      this.kickTarget = [];
      throw new Error('强退失败');
    }
  }

  // ==================== 刷新 ====================
  @autobind
  async refresh(): Promise<void> {
    await this.loadOnlineUsers();
  }
}
