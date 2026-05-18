export interface OnlineUser {
  token: string;
  userName: string;
  deptName: string;
  ipAddress: string;
  location: string;
  browser: string;
  os: string;
  loginTime: string;
  lastActivityTime: string;
  status: 'online';
}

export interface OnlineUserQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  userName?: string;
  ipAddress?: string;
  location?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

@Injectable()
export class OnlineUserService {
  async queryList(
    params: OnlineUserQueryParams = {},
  ): Promise<PageResult<OnlineUser>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        query[key] = String(value);
      }
    }
    return $fetch('/api/online-users', { query });
  }

  async kickOne(token: string): Promise<{ success: boolean; message: string }> {
    return $fetch(`/api/online-users/${token}`, { method: 'DELETE' });
  }

  async kickBatch(
    tokens: string[],
  ): Promise<{ success: boolean; message: string }> {
    return $fetch('/api/online-users', {
      method: 'DELETE',
      body: { tokens },
    });
  }
}
