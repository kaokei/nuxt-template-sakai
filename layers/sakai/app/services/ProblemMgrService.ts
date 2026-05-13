import type { Problem } from '@sakai/services/ProblemService';
import { ProblemService } from '@sakai/services/ProblemService';
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
export class ProblemMgrService {
  @Inject(ProblemService)
  private problemService!: ProblemService;

  // ==================== 表格数据状态 ====================
  problems: Problem[] = [];
  totalRecords = 0;
  loading = false;
  selectedProblems: Problem[] = [];

  // ==================== 分页参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'problemNumber';
  sortOrder: number = 1;
  searchParams: Record<string, any> = {};

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: Problem | null = null;
  deleteDialogVisible = false;
  deleteMode: 'single' | 'batch' = 'single';
  deleteTarget: Problem | null = null;

  // ==================== 显示映射 ====================
  readonly difficultyLabels: Record<string, string> = {
    Easy: '简单',
    Medium: '中等',
    Hard: '困难',
  };
  readonly accessLevelLabels: Record<string, string> = {
    Public: '公开',
    Private: '私有',
    Shared: '共享',
  };

  // ==================== 工具函数 ====================

  getDifficultySeverity(
    difficulty: string,
  ): 'success' | 'warn' | 'danger' | 'info' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
      Easy: 'success',
      Medium: 'warn',
      Hard: 'danger',
    };
    return map[difficulty] || 'info';
  }

  getAccessSeverity(level: string): 'success' | 'info' | 'warn' {
    const map: Record<string, 'success' | 'info' | 'warn'> = {
      Public: 'success',
      Shared: 'info',
      Private: 'warn',
    };
    return map[level] || 'info';
  }

  formatDate(date: Date): string {
    if (!date) return '--';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  formatDateTime(date: Date): string {
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

  async loadProblems(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.problemService.queryProblems({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.problems = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 搜索与重置 ====================

  onSearch(params: Record<string, any>): void {
    this.searchParams = params;
    this.page = 1;
    this.loadProblems();
  }

  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadProblems();
  }

  // ==================== 分页与排序 ====================

  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadProblems();
  }

  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadProblems();
  }

  // ==================== 表单弹窗操作 ====================

  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  openEdit(problem: Problem): void {
    this.editData = { ...problem };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadProblems();
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================

  confirmDelete(problem: Problem): void {
    this.deleteMode = 'single';
    this.deleteTarget = problem;
    this.deleteDialogVisible = true;
  }

  confirmBatchDelete(): void {
    if (!this.selectedProblems || this.selectedProblems.length === 0) return;
    this.deleteMode = 'batch';
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteMode === 'single' && this.deleteTarget) {
      await this.problemService.deleteProblem(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadProblems();
      return { success: true, message: '题目已删除' };
    }

    const ids = (this.selectedProblems || []).map((p) => p.id);
    await this.problemService.deleteProblems(ids);
    this.selectedProblems = [];
    this.deleteDialogVisible = false;
    this.loadProblems();
    return { success: true, message: `已删除 ${ids.length} 道题目` };
  }
}
