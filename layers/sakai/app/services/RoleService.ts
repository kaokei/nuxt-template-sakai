// ==================== 接口定义 ====================

export interface Role {
  id: string;
  name: string;
  code: string;
  order: number;
  dataScope: 'all' | 'deptAndBelow' | 'dept' | 'self' | 'custom';
  menuIds: string[];
  deptIds: string[];
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}

export interface RoleQueryParams {
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: number;
  name?: string;
  code?: string;
  status?: string;
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

export interface DeleteResult {
  success: true;
  message: string;
}

export interface SaveResult {
  success: true;
  isEdit: boolean;
}

// ==================== 服务类 ====================

@Injectable()
export class RoleService {
  /** 查询角色列表（分页） */
  async queryRoles(params: RoleQueryParams = {}): Promise<PageResult<Role>> {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        query[key] = String(value);
      }
    }
    return $fetch('/api/roles', { query });
  }

  /** 获取角色下拉选项 */
  async getRoleOptions(): Promise<SelectOption[]> {
    const res = await $fetch<{ data: { roleOptions: SelectOption[] } }>(
      '/api/roles/options',
    );
    return res.data.roleOptions;
  }

  /** 根据 ID 获取单个角色 */
  async getRoleById(id: string): Promise<Role | undefined> {
    try {
      return await $fetch(`/api/roles/${id}`);
    } catch {
      return undefined;
    }
  }

  /** 创建角色 */
  async createRole(data: Omit<Role, 'id' | 'createTime'>): Promise<Role> {
    return $fetch('/api/roles', { method: 'POST', body: data });
  }

  /** 更新角色 */
  async updateRole(id: string, data: Partial<Role>): Promise<Role> {
    return $fetch(`/api/roles/${id}`, { method: 'PUT', body: data });
  }

  /** 删除单个角色 */
  async deleteRole(id: string): Promise<boolean> {
    await $fetch(`/api/roles/${id}`, { method: 'DELETE' });
    return true;
  }

  /** 批量删除角色 */
  async deleteRoles(ids: string[]): Promise<number> {
    const res = await $fetch('/api/roles/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return (res as { deleted: number }).deleted;
  }
}
