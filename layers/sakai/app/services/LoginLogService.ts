export interface LoginLog {
  id: string;
  userName: string;
  loginTime: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  status: 'success' | 'fail';
  message: string;
}

export interface LoginLogQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  userName?: string;
  ipAddress?: string;
  status?: string;
  loginTimeFrom?: string;
  loginTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

interface LoginLogOptions {
  statusOptions: SelectOption[];
}

@Injectable()
export class LoginLogService {
  private optionsCache: LoginLogOptions | null = null;

  private async loadOptions(): Promise<LoginLogOptions> {
    if (this.optionsCache) return this.optionsCache;
    this.optionsCache = await $fetch<LoginLogOptions>(
      '/api/login-logs/options',
    );
    return this.optionsCache;
  }

  async getStatusOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.statusOptions;
  }

  async queryLogs(
    params: LoginLogQueryParams = {},
  ): Promise<PageResult<LoginLog>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] =
          value instanceof Date ? value.toISOString() : String(value);
      }
    }
    return $fetch('/api/login-logs', { query });
  }

  async getLogById(id: string): Promise<LoginLog | undefined> {
    try {
      return await $fetch(`/api/login-logs/${id}`);
    } catch {
      return undefined;
    }
  }
}
