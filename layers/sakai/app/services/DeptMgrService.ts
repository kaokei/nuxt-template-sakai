import type { Dept, DeptTreeNode } from '@sakai/services/DeptService';
import { DeptService } from '@sakai/services/DeptService';
import type { TreeTableSortEvent } from 'primevue/treetable';

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

@Injectable()
export class DeptMgrService {
  @Inject(DeptService)
  private deptService!: DeptService;

  treeNodes: DeptTreeNode[] = [];
  allDepts: Dept[] = [];
  loading = false;
  selectedNodes: Record<string, any> = {};
  keyword = '';
  searchStatus: string | null = null;
  searchCreateTimeRange: Date[] | null = null;
  sortField = 'order';
  sortOrder: number = 1;
  expandedKeys: Record<string, boolean> = {};

  formDialogVisible = false;
  editData: Dept | null = null;
  newDeptParentId: string | null = null;
  deleteDialogVisible = false;
  deleteTarget: DeptTreeNode | null = null;

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

  private buildTree(depts: Dept[]): DeptTreeNode[] {
    function buildChildren(parentId: string | null): DeptTreeNode[] {
      return depts
        .filter((d) => d.parentId === parentId)
        .sort((a, b) => a.order - b.order)
        .map((d) => ({
          key: d.id,
          data: d,
          name: d.name,
          leader: d.leader,
          phone: d.phone,
          email: d.email,
          order: d.order,
          status: d.status,
          createTime: d.createTime,
          children: buildChildren(d.id),
        }));
    }
    return buildChildren(null);
  }

  async loadDepts(params?: {
    keyword?: string;
    status?: string | null;
    createTimeFrom?: string;
    createTimeTo?: string;
  }): Promise<void> {
    this.loading = true;
    try {
      const k =
        typeof params?.keyword === 'string' ? params.keyword : this.keyword;
      this.allDepts = await this.deptService.queryDepts(
        k,
        params?.status ?? this.searchStatus ?? undefined,
        params?.createTimeFrom,
        params?.createTimeTo,
      );
      this.treeNodes = this.buildTree(this.allDepts);
      this.expandedKeys = this.computeDefaultExpandedKeys(this.treeNodes);
    } finally {
      this.loading = false;
    }
  }

  private computeDefaultExpandedKeys(
    nodes: DeptTreeNode[],
  ): Record<string, boolean> {
    const keys: Record<string, boolean> = {};
    for (const node of nodes) {
      keys[node.key] = true;
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          keys[child.key] = true;
        }
      }
    }
    return keys;
  }

  sortTree(nodes: DeptTreeNode[]): DeptTreeNode[] {
    const sorted = [...nodes].sort((a, b) => {
      const valA = (a as Record<string, any>)[this.sortField];
      const valB = (b as Record<string, any>)[this.sortField];
      const dir = this.sortOrder;
      if (valA == null && valB == null) return 0;
      if (valA == null) return 1 * dir;
      if (valB == null) return -1 * dir;
      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * dir;
      }
      return (valA - valB) * dir;
    });
    return sorted.map((node) => {
      if (node.children && node.children.length > 0) {
        return { ...node, children: this.sortTree(node.children) };
      }
      return node;
    });
  }

  @autobind
  onSearch(params: {
    keyword?: string;
    status?: string | null;
    createTimeFrom?: string;
    createTimeTo?: string;
  }): void {
    this.keyword = params.keyword ?? '';
    this.searchStatus = params.status ?? null;
    this.loadDepts(params);
  }

  @autobind
  onReset(): void {
    this.keyword = '';
    this.searchStatus = null;
    this.searchCreateTimeRange = null;
    this.loadDepts();
  }

  @autobind
  onSort(event: TreeTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder!;
    this.treeNodes = this.sortTree(this.treeNodes);
  }

  @autobind
  openNew(): void {
    this.editData = null;
    this.newDeptParentId = null;
    this.formDialogVisible = true;
  }

  @autobind
  openNewChild(parentDept: Dept): void {
    this.editData = null;
    this.newDeptParentId = parentDept.id;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(dept: Dept): void {
    this.editData = { ...dept };
    this.formDialogVisible = true;
  }

  onSaved(): SaveResult {
    const isEdit = !!this.editData;
    this.loadDepts();
    return { success: true, isEdit };
  }

  @autobind
  confirmDelete(node: DeptTreeNode): void {
    this.deleteTarget = node;
    this.deleteDialogVisible = true;
  }

  /** 获取勾选的节点 ID 列表 */
  private getSelectedIds(): string[] {
    return Object.keys(this.selectedNodes).filter(
      (k) => this.selectedNodes[k]?.checked === true,
    );
  }

  /** 是否有任何选中节点 */
  get hasSelection(): boolean {
    return this.getSelectedIds().length > 0;
  }

  @autobind
  confirmBatchDelete(): void {
    if (!this.hasSelection) return;
    this.deleteTarget = null;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<DeleteResult> {
    if (this.deleteTarget) {
      const result = await this.deptService.deleteDept(this.deleteTarget.key);
      this.deleteDialogVisible = false;
      this.loadDepts();
      return { success: true, message: `已删除 ${result.deletedCount} 个部门` };
    }

    const ids = this.getSelectedIds();
    const deletedCount = await this.deptService.deleteDepts(ids);
    this.selectedNodes = {};
    this.deleteDialogVisible = false;
    this.loadDepts();
    return { success: true, message: `已删除 ${deletedCount} 个部门` };
  }
}
