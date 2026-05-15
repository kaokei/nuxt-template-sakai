export interface User {
  id: string;
  userName: string;
  nickName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  avatar: string;
  deptId: string;
  deptName: string;
  roleIds: string[];
  roleNames: string[];
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  userName?: string;
  nickName?: string;
  phone?: string;
  status?: string;
  deptId?: string;
  createTimeFrom?: string;
  createTimeTo?: string;
}

export interface PageResult<T> {
  data: T[];
  total: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface UserOptions {
  deptOptions: SelectOption[];
  roleOptions: SelectOption[];
  genderOptions: SelectOption[];
  statusOptions: SelectOption[];
}

@Injectable()
export class UserService {
  private optionsCache: UserOptions | null = null;

  private async loadOptions(): Promise<UserOptions> {
    if (this.optionsCache) return this.optionsCache;
    this.optionsCache = await $fetch<UserOptions>('/api/users/options');
    return this.optionsCache;
  }

  async getDeptOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.deptOptions;
  }

  async getRoleOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.roleOptions;
  }

  async getGenderOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.genderOptions;
  }

  async getStatusOptions(): Promise<SelectOption[]> {
    const opts = await this.loadOptions();
    return opts.statusOptions;
  }

  async getUserOptions(): Promise<UserOptions> {
    return this.loadOptions();
  }

  async queryUsers(params: UserQueryParams = {}): Promise<PageResult<User>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query[key] =
          value instanceof Date ? value.toISOString() : String(value);
      }
    }
    return $fetch('/api/users', { query });
  }

  async getUserById(id: string): Promise<User | undefined> {
    try {
      return await $fetch(`/api/users/${id}`);
    } catch {
      return undefined;
    }
  }

  async createUser(data: Omit<User, 'id' | 'createTime'>): Promise<User> {
    return $fetch('/api/users', { method: 'POST', body: data });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return $fetch(`/api/users/${id}`, { method: 'PUT', body: data });
  }

  async deleteUser(id: string): Promise<boolean> {
    await $fetch(`/api/users/${id}`, { method: 'DELETE' });
    return true;
  }

  async deleteUsers(ids: string[]): Promise<number> {
    const res = await $fetch('/api/users/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return (res as { deleted: number }).deleted;
  }
}
