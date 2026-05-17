import { PostService } from '@sakai/services/PostService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import type { Post } from '~/types/post';

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

@Injectable()
export class PostMgrService {
  @Inject(PostService)
  private postService!: PostService;

  // ==================== 表格数据状态 ====================
  posts: Post[] = [];
  totalRecords = 0;
  loading = false;
  selectedPosts: Post[] = [];

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'sort';
  sortOrder: number = 1;
  searchParams: Record<string, any> = {};

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: Post | null = null;
  deleteDialogVisible = false;
  deleteMode: 'single' | 'batch' = 'single';
  deleteTarget: Post | null = null;

  // ==================== 显示映射 ====================
  readonly statusLabels: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
  };

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

  async loadPosts(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.postService.getList({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.posts = result.data;
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
    this.loadPosts();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadPosts();
  }

  // ==================== 分页与排序 ====================

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadPosts();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadPosts();
  }

  // ==================== 表单弹窗操作 ====================

  @autobind
  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(post: Post): void {
    this.editData = { ...post };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadPosts();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  @autobind
  confirmDelete(post: Post): void {
    this.deleteMode = 'single';
    this.deleteTarget = post;
    this.deleteDialogVisible = true;
  }

  @autobind
  confirmBatchDelete(): void {
    if (!this.selectedPosts || this.selectedPosts.length === 0) return;
    this.deleteMode = 'batch';
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteMode === 'single' && this.deleteTarget) {
      await this.postService.delete(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadPosts();
      return { success: true, message: '岗位已删除' };
    }

    const ids = (this.selectedPosts || []).map((p) => p.id);
    for (const id of ids) {
      await this.postService.delete(id);
    }
    this.selectedPosts = [];
    this.deleteDialogVisible = false;
    this.loadPosts();
    return { success: true, message: `已删除 ${ids.length} 个岗位` };
  }
}
