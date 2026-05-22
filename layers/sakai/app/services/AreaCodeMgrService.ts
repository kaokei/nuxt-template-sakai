import { AreaCodeService } from '@sakai/services/AreaCodeService';
import type { DataTableSortEvent } from 'primevue/datatable';
import type { AreaCode } from '~/types/area-code';
import { CONTINENT_OPTIONS } from '~/types/area-code';

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

@Injectable()
export class AreaCodeMgrService {
  @Inject(AreaCodeService)
  private areaCodeService!: AreaCodeService;

  // ==================== 表格数据状态 ====================
  list: AreaCode[] = [];
  totalRecords = 0;
  loading = false;
  selectedItems: AreaCode[] = [];

  // ==================== 排序参数 ====================
  sortField = 'sort';
  sortOrder: number = 1;
  searchParams: Record<string, any> = {};

  // ==================== 搜索字段 ====================
  searchRegionName = '';
  searchCode = '';
  searchContinent = '';
  searchStatus = '';

  // ==================== 弹窗状态 ====================
  formDialogVisible = false;
  editData: AreaCode | null = null;
  deleteDialogVisible = false;
  deleteMode: 'single' | 'batch' = 'single';
  deleteTarget: AreaCode | null = null;

  // 验证规则弹窗
  ruleDialogVisible = false;
  ruleTarget: AreaCode | null = null;

  // ==================== 大洲选项 ====================
  readonly continentOptions = CONTINENT_OPTIONS;

  // ==================== 国旗 emoji ====================
  getFlagEmoji(countryCode: string): string {
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
    return String.fromCodePoint(...codePoints);
  }

  // ==================== 数据加载 ====================
  async loadList(): Promise<void> {
    this.loading = true;
    try {
      const params: Record<string, any> = {
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        regionName: this.searchRegionName || undefined,
        code: this.searchCode || undefined,
        continent: this.searchContinent || undefined,
      };
      if (this.searchStatus === 'enabled') {
        params.enabled = true;
      } else if (this.searchStatus === 'disabled') {
        params.enabled = false;
      }
      const result = await this.areaCodeService.getList(params);
      this.list = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  // ==================== 搜索与重置 ====================
  @autobind
  search(): void {
    this.loadList();
  }

  @autobind
  onReset(): void {
    this.searchRegionName = '';
    this.searchCode = '';
    this.searchContinent = '';
    this.searchStatus = '';
    this.loadList();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.loadList();
  }

  // ==================== 表单弹窗操作 ====================
  @autobind
  openNew(): void {
    this.editData = null;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(item: AreaCode): void {
    this.editData = { ...item };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadList();
    return { success: true, isEdit };
  }

  // ==================== 新增/编辑操作 ====================
  async save(data: Omit<AreaCode, 'id'>): Promise<SaveResult> {
    const isEdit = !!this.editData;
    if (isEdit && this.editData) {
      await this.areaCodeService.update(this.editData.id, data);
    } else {
      await this.areaCodeService.create(data);
    }
    return { success: true, isEdit };
  }

  // ==================== 删除操作 ====================
  @autobind
  confirmDelete(item: AreaCode): void {
    this.deleteMode = 'single';
    this.deleteTarget = item;
    this.deleteDialogVisible = true;
  }

  @autobind
  confirmBatchDelete(): void {
    if (!this.selectedItems || this.selectedItems.length === 0) return;
    this.deleteMode = 'batch';
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteMode === 'single' && this.deleteTarget) {
      await this.areaCodeService.delete(this.deleteTarget.id);
      this.deleteDialogVisible = false;
      this.loadList();
      return { success: true, message: '区号已删除' };
    }

    const ids = (this.selectedItems || []).map((p) => p.id);
    for (const id of ids) {
      await this.areaCodeService.delete(id);
    }
    this.selectedItems = [];
    this.deleteDialogVisible = false;
    this.loadList();
    return { success: true, message: `已删除 ${ids.length} 个区号` };
  }

  // ==================== 批量启用/禁用 ====================
  @autobind
  async batchEnable(): Promise<void> {
    if (!this.selectedItems || this.selectedItems.length === 0) return;
    const ids = this.selectedItems.map((item) => item.id);
    await this.areaCodeService.batchUpdate(ids, { enabled: true });
    this.loadList();
  }

  @autobind
  async batchDisable(): Promise<void> {
    if (!this.selectedItems || this.selectedItems.length === 0) return;
    const ids = this.selectedItems.map((item) => item.id);
    await this.areaCodeService.batchUpdate(ids, { enabled: false });
    this.loadList();
  }

  // ==================== 状态切换 ====================
  @autobind
  async toggleEnabled(item: AreaCode): Promise<void> {
    await this.areaCodeService.update(item.id, { enabled: !item.enabled });
    this.loadList();
  }

  // ==================== 验证规则弹窗 ====================
  @autobind
  openRuleDialog(item: AreaCode): void {
    this.ruleTarget = { ...item };
    this.ruleDialogVisible = true;
  }

  onRuleSaved(): void {
    this.loadList();
  }

  async saveRule(id: string, rule: string): Promise<void> {
    await this.areaCodeService.update(id, { validationRule: rule });
  }

  // ==================== 复制区号 ====================
  @autobind
  async copyCode(code: string): Promise<void> {
    await navigator.clipboard.writeText(`+${code}`);
  }
}
