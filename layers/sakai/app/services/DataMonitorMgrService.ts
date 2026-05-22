import {
  type DataMonitorInfo,
  DataMonitorService,
  type SqlStat,
  type UriStat,
} from '@sakai/services/DataMonitorService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';

@Injectable()
export class DataMonitorMgrService {
  @Inject(DataMonitorService)
  private dataMonitorService!: DataMonitorService;

  // ==================== 概览数据 ====================
  monitorInfo: DataMonitorInfo | null = null;
  overviewLoading = false;

  // ==================== SQL 统计表格 ====================
  sqlList: SqlStat[] = [];
  sqlTotalRecords = 0;
  sqlLoading = false;
  sqlPage = 1;
  sqlPageSize = 10;
  sqlSortField = 'avgTime';
  sqlSortOrder: number = -1;

  // ==================== URI 统计表格 ====================
  uriList: UriStat[] = [];
  uriTotalRecords = 0;
  uriLoading = false;
  uriPage = 1;
  uriPageSize = 10;
  uriSortField = 'avgTime';
  uriSortOrder: number = -1;

  /** 格式化毫秒数 */
  formatMs(ms: number): string {
    if (ms < 1) return '< 1 ms';
    if (ms < 1000) return `${ms.toFixed(1)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  }

  /** 格式化数字 */
  formatNumber(n: number): string {
    if (n >= 10000) return `${(n / 10000).toFixed(1)} 万`;
    return n.toLocaleString('zh-CN');
  }

  // ==================== 数据加载 ====================
  async loadOverview(): Promise<void> {
    this.overviewLoading = true;
    try {
      this.monitorInfo = await this.dataMonitorService.getMonitorInfo();
    } finally {
      this.overviewLoading = false;
    }
  }

  async loadSqlList(): Promise<void> {
    this.sqlLoading = true;
    try {
      const result = await this.dataMonitorService.querySqlList({
        page: this.sqlPage,
        pageSize: this.sqlPageSize,
        sortField: this.sqlSortField,
        sortOrder: this.sqlSortOrder,
      });
      this.sqlList = result.data;
      this.sqlTotalRecords = result.total;
    } finally {
      this.sqlLoading = false;
    }
  }

  async loadUriList(): Promise<void> {
    this.uriLoading = true;
    try {
      const result = await this.dataMonitorService.queryUriList({
        page: this.uriPage,
        pageSize: this.uriPageSize,
        sortField: this.uriSortField,
        sortOrder: this.uriSortOrder,
      });
      this.uriList = result.data;
      this.uriTotalRecords = result.total;
    } finally {
      this.uriLoading = false;
    }
  }

  async loadAll(): Promise<void> {
    await Promise.all([
      this.loadOverview(),
      this.loadSqlList(),
      this.loadUriList(),
    ]);
  }

  // ==================== SQL 分页与排序 ====================
  @autobind
  onSqlPage(event: DataTablePageEvent): void {
    this.sqlPage = event.page + 1;
    this.sqlPageSize = event.rows;
    this.loadSqlList();
  }

  @autobind
  onSqlSort(event: DataTableSortEvent): void {
    this.sqlSortField = String(event.sortField ?? 'avgTime');
    this.sqlSortOrder = event.sortOrder ?? -1;
    this.loadSqlList();
  }

  // ==================== URI 分页与排序 ====================
  @autobind
  onUriPage(event: DataTablePageEvent): void {
    this.uriPage = event.page + 1;
    this.uriPageSize = event.rows;
    this.loadUriList();
  }

  @autobind
  onUriSort(event: DataTableSortEvent): void {
    this.uriSortField = String(event.sortField ?? 'avgTime');
    this.uriSortOrder = event.sortOrder ?? -1;
    this.loadUriList();
  }

  // ==================== 刷新 ====================
  @autobind
  async refresh(): Promise<void> {
    await this.loadAll();
  }
}
