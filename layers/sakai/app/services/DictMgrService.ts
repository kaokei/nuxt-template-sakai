import type { DictData, DictType } from '@sakai/services/DictService';
import { DictService } from '@sakai/services/DictService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

@Injectable()
export class DictMgrService {
  @Inject(DictService)
  private dictService!: DictService;

  // ==================== 字典类型表格状态 ====================
  dictTypes: DictType[] = [];
  totalRecords = 0;
  loading = false;
  selectedTypes: DictType[] = [];

  // 分页参数
  page = 1;
  pageSize = 10;
  sortField = 'createTime';
  sortOrder: number = -1;
  searchParams: Record<string, any> = {};

  // 展开行管理
  expandedRows: DictType[] = [];
  // 已加载的字典数据缓存 { typeCode: DictData[] }
  private dataCache: Record<string, DictData[]> = {};

  // ==================== 字典类型弹窗状态 ====================
  typeFormDialogVisible = false;
  typeEditData: DictType | null = null;
  typeDeleteDialogVisible = false;
  typeDeleteMode: 'single' | 'batch' = 'single';
  typeDeleteTarget: DictType | null = null;
  typeDeleteDataCount = 0;

  // ==================== 字典数据弹窗状态 ====================
  dataFormDialogVisible = false;
  dataEditData: DictData | null = null;
  dataFormTypeCode = '';
  dataDeleteDialogVisible = false;
  dataDeleteTarget: DictData | null = null;

  // ==================== 显示映射 ====================
  readonly statusLabels: Record<string, string> = {
    active: '启用',
    inactive: '禁用',
  };

  readonly listClassLabels: Record<string, string> = {
    success: 'success',
    info: 'info',
    warn: 'warn',
    danger: 'danger',
  };

  @Computed()
  get listClassSeverity(): Record<
    string,
    'success' | 'info' | 'warn' | 'danger' | undefined
  > {
    return {
      '': undefined,
      success: 'success',
      info: 'info',
      warn: 'warn',
      danger: 'danger',
    };
  }

  getStatusSeverity(status: string): 'success' | 'danger' {
    return status === 'active' ? 'success' : 'danger';
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

  // ==================== 字典类型数据加载 ====================

  async loadTypes(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.dictService.queryTypes({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.dictTypes = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 字典数据加载（按类型编码） ====================

  getDataByType(typeCode: string): DictData[] {
    return this.dataCache[typeCode] || [];
  }

  async loadDataByType(typeCode: string): Promise<void> {
    try {
      const result = await this.dictService.queryData({
        typeCode,
        pageSize: 100,
      });
      this.dataCache[typeCode] = result.data;
    } catch {
      this.dataCache[typeCode] = [];
    }
  }

  // ==================== 搜索与重置 ====================

  @autobind
  onSearch(params: Record<string, any>): void {
    this.searchParams = params;
    this.page = 1;
    this.loadTypes();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadTypes();
  }

  // ==================== 分页与排序 ====================

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadTypes();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadTypes();
  }

  // ==================== 行展开事件 ====================

  @autobind
  onRowExpand(event: { data: DictType }): void {
    const typeCode = event.data.code;
    if (!this.dataCache[typeCode]) {
      this.loadDataByType(typeCode);
    }
  }

  @autobind
  expandAll(): void {
    this.expandedRows = [...this.dictTypes];
    for (const type of this.dictTypes) {
      if (!this.dataCache[type.code]) {
        this.loadDataByType(type.code);
      }
    }
  }

  @autobind
  collapseAll(): void {
    this.expandedRows = [];
  }

  // ==================== 字典类型表单操作 ====================

  @autobind
  openNewType(): void {
    this.typeEditData = null;
    this.typeFormDialogVisible = true;
  }

  @autobind
  openEditType(type: DictType): void {
    this.typeEditData = { ...type };
    this.typeFormDialogVisible = true;
  }

  @autobind
  onTypeSaved(): { isEdit: boolean } {
    const isEdit = !!this.typeEditData;
    this.loadTypes();
    return { isEdit };
  }

  // ==================== 字典类型删除操作（含级联） ====================

  @autobind
  async confirmDeleteType(type: DictType): Promise<void> {
    this.typeDeleteMode = 'single';
    this.typeDeleteTarget = type;
    // 查询关联数据数量
    try {
      const result = await this.dictService.queryData({
        typeCode: type.code,
        pageSize: 1,
      });
      this.typeDeleteDataCount = result.total;
    } catch {
      this.typeDeleteDataCount = 0;
    }
    this.typeDeleteDialogVisible = true;
  }

  @autobind
  confirmBatchDeleteType(): void {
    if (!this.selectedTypes || this.selectedTypes.length === 0) return;
    this.typeDeleteMode = 'batch';
    this.typeDeleteTarget = null;
    this.typeDeleteDialogVisible = true;
  }

  async onTypeDeleteConfirm(): Promise<{ success: true; message: string }> {
    if (this.typeDeleteMode === 'single' && this.typeDeleteTarget) {
      const result = await this.dictService.deleteType(
        this.typeDeleteTarget.id,
      );
      // 清除缓存
      this.dataCache = Object.fromEntries(
        Object.entries(this.dataCache).filter(
          ([k]) => k !== this.typeDeleteTarget?.code,
        ),
      );
      this.typeDeleteDialogVisible = false;
      this.loadTypes();
      return {
        success: true,
        message: `已删除字典类型「${result.typeName}」，同时删除了 ${result.deletedDataCount} 条字典数据`,
      };
    }

    const ids = (this.selectedTypes || []).map((t) => t.id);
    const codes = (this.selectedTypes || []).map((t) => t.code);
    const result = await this.dictService.deleteTypes(ids);
    // 清除缓存
    this.dataCache = Object.fromEntries(
      Object.entries(this.dataCache).filter(([k]) => !codes.includes(k)),
    );
    this.selectedTypes = [];
    this.typeDeleteDialogVisible = false;
    this.loadTypes();
    return {
      success: true,
      message: `已删除 ${result.deletedTypes} 个字典类型，同时删除了 ${result.deletedDatas} 条字典数据`,
    };
  }

  // ==================== 字典数据表单操作 ====================

  @autobind
  openNewData(typeCode: string): void {
    this.dataEditData = null;
    this.dataFormTypeCode = typeCode;
    this.dataFormDialogVisible = true;
  }

  @autobind
  openEditData(data: DictData): void {
    this.dataEditData = { ...data };
    this.dataFormTypeCode = data.typeCode;
    this.dataFormDialogVisible = true;
  }

  @autobind
  onDataSaved(typeCode: string): void {
    this.loadDataByType(typeCode);
  }

  // ==================== 字典数据删除操作 ====================

  @autobind
  confirmDeleteData(data: DictData): void {
    this.dataDeleteTarget = data;
    this.dataDeleteDialogVisible = true;
  }

  async onDataDeleteConfirm(): Promise<{ success: true; message: string }> {
    if (!this.dataDeleteTarget) {
      throw new Error('no delete target');
    }
    const typeCode = this.dataDeleteTarget.typeCode;
    await this.dictService.deleteData(this.dataDeleteTarget.id);
    this.dataDeleteDialogVisible = false;
    this.loadDataByType(typeCode);
    return { success: true, message: '字典数据已删除' };
  }
}
