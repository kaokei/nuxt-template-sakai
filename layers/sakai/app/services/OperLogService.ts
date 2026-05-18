export interface OperLog {
  id: string;
  userName: string;
  operationTime: string;
  module: string;
  operationType: string;
  title: string;
  requestMethod: string;
  requestUrl: string;
  requestParams: string;
  responseResult: string;
  ipAddress: string;
  location: string;
  status: 'success' | 'fail';
  duration: number;
  errorMsg: string;
}

export interface OperLogQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  userName?: string;
  module?: string;
  operationType?: string;
  status?: string;
  operationTimeFrom?: string;
  operationTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

interface OperLogOptions {
  moduleOptions: SelectOption[];
  operationTypeOptions: SelectOption[];
  statusOptions: SelectOption[];
}

@Injectable()
export class OperLogService {
  private optionsCache: OperLogOptions | null = null;

  private async loadOptions(): Promise<OperLogOptions> {
    if (this.optionsCache) return this.optionsCache;
    this.optionsCache = await $fetch<OperLogOptions>('/api/oper-logs/options');
    return this.optionsCache;
  }

  async getModuleOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.moduleOptions;
  }

  async getOperationTypeOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.operationTypeOptions;
  }

  async getStatusOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.statusOptions;
  }

  async queryLogs(
    params: OperLogQueryParams = {},
  ): Promise<PageResult<OperLog>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] =
          value instanceof Date ? value.toISOString() : String(value);
      }
    }
    return $fetch('/api/oper-logs', { query });
  }

  async getLogById(id: string): Promise<OperLog | undefined> {
    try {
      return await $fetch(`/api/oper-logs/${id}`);
    } catch {
      return undefined;
    }
  }
}
