import {
  type CacheItem,
  CacheListService,
} from '@sakai/services/CacheListService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

@Injectable()
export class CacheListMgrService {
  @Inject(CacheListService)
  private cacheListService!: CacheListService;

  // ==================== 表格数据状态 ====================
  cacheItems: CacheItem[] = [];
  totalRecords = 0;
  loading = false;

  // ==================== 选中状态 ====================
  selectedItems: CacheItem[] = [];

  // ==================== 分页与参数 ====================
  page = 1;
  pageSize = 10;
  sortField = 'createTime';
  sortOrder: number = -1;
  searchParams: Record<string, any> = {};

  // ==================== 清除确认弹窗状态 ====================
  clearDialogVisible = false;
  clearTarget: CacheItem[] = [];

  // ==================== 详情弹窗状态 ====================
  detailDialogVisible = false;
  detailItem: CacheItem | null = null;

  // ==================== 数据加载 ====================
  async loadCacheList(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.cacheListService.queryList({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.cacheItems = result.data;
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
    this.loadCacheList();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadCacheList();
  }

  // ==================== 分页与排序 ====================
  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadCacheList();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = String(event.sortField ?? 'createTime');
    this.sortOrder = event.sortOrder ?? -1;
    this.loadCacheList();
  }

  // ==================== 清除确认弹窗 ====================
  @autobind
  confirmClearOne(item: CacheItem): void {
    this.clearTarget = [item];
    this.clearDialogVisible = true;
  }

  @autobind
  confirmClearBatch(): void {
    if (this.selectedItems.length === 0) return;
    this.clearTarget = [...this.selectedItems];
    this.clearDialogVisible = true;
  }

  @autobind
  onClearCancel(): void {
    this.clearDialogVisible = false;
    this.clearTarget = [];
  }

  async onClearConfirm(): Promise<{ success: boolean; message: string }> {
    const names = this.clearTarget.map((item) => item.cacheName);
    const [singleName] = names;
    try {
      const result =
        names.length === 1
          ? await this.cacheListService.clearOne(singleName!)
          : await this.cacheListService.clearBatch(names);
      if (result.success) {
        this.clearTarget = [];
        this.selectedItems = [];
        await this.loadCacheList();
      }
      return result;
    } catch {
      this.clearTarget = [];
      throw new Error('清除缓存失败');
    }
  }

  // ==================== 详情弹窗 ====================
  @autobind
  async showDetail(item: CacheItem): Promise<void> {
    this.detailItem = item;
    this.detailDialogVisible = true;
  }

  @autobind
  onDetailHide(): void {
    this.detailDialogVisible = false;
    this.detailItem = null;
  }

  // ==================== 刷新 ====================
  @autobind
  async refresh(): Promise<void> {
    await this.loadCacheList();
  }
}
