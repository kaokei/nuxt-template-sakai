/** SQL 执行统计 */
export interface SqlStat {
  sql: string;
  executeCount: number;
  avgTime: number;
  maxTime: number;
  errorCount: number;
  slowCount: number;
  lastExecuteTime: string;
}

/** URI 请求统计 */
export interface UriStat {
  uri: string;
  requestCount: number;
  avgTime: number;
  maxTime: number;
  lastRequestTime: string;
}

/** 数据监控全量信息 */
export interface DataMonitorInfo {
  poolStats: {
    activeCount: number;
    maxActive: number;
    waitCount: number;
    poolingPeak: number;
    initialSize: number;
    minIdle: number;
  };
  sqlStats: {
    executeCount: number;
    slowCount: number;
    errorCount: number;
    avgTime: number;
  };
  sqlList: SqlStat[];
  uriList: UriStat[];
}

/** SQL 统计查询参数 */
export interface SqlStatQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
}

@Injectable()
export class DataMonitorService {
  /** 获取数据监控概览（连接池 + SQL 统计摘要） */
  async getMonitorInfo(): Promise<DataMonitorInfo> {
    return $fetch<DataMonitorInfo>('/api/data-monitor');
  }

  /** 分页查询 SQL 执行统计列表 */
  async querySqlList(
    params: SqlStatQueryParams = {},
  ): Promise<{ data: SqlStat[]; total: number }> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/data-monitor/sql-list', { query });
  }

  /** 分页查询 URI 请求统计列表 */
  async queryUriList(
    params: SqlStatQueryParams = {},
  ): Promise<{ data: UriStat[]; total: number }> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/data-monitor/uri-list', { query });
  }
}
