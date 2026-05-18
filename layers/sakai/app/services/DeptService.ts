// ==================== 部门接口定义 ====================

export interface Dept {
  id: string;
  name: string;
  parentId: string | null;
  leader: string;
  leaderId: string;
  phone: string;
  email: string;
  order: number;
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}

/** PrimeTreeTable 使用的树节点 */
export interface DeptTreeNode {
  key: string;
  data: Dept;
  children?: DeptTreeNode[];
  // 展平显示字段
  name: string;
  leader: string;
  phone: string;
  email: string;
  order: number;
  status: string;
  createTime: string;
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

// ==================== 部门数据服务 ====================

@Injectable()
export class DeptService {
  /** 查询部门列表（扁平数组） */
  async queryDepts(
    keyword?: string,
    status?: string,
    createTimeFrom?: string,
    createTimeTo?: string,
  ): Promise<Dept[]> {
    const query: Record<string, string> = {};
    if (keyword) {
      query.keyword = keyword;
    }
    if (status) {
      query.status = status;
    }
    if (createTimeFrom) {
      query.createTimeFrom = createTimeFrom;
    }
    if (createTimeTo) {
      query.createTimeTo = createTimeTo;
    }
    const res = await $fetch<{ data: Dept[] }>('/api/depts', { query });
    return res.data;
  }

  /** 根据 ID 获取单个部门 */
  async getDeptById(id: string): Promise<Dept | undefined> {
    try {
      return await $fetch<Dept>(`/api/depts/${id}`);
    } catch {
      return undefined;
    }
  }

  /** 获取部门下拉选项（平铺，用于角色等页面的部门多选） */
  async getDeptOptions(): Promise<SelectOption[]> {
    const res = await $fetch<{ data: { deptOptions: SelectOption[] } }>(
      '/api/depts/options',
    );
    return res.data.deptOptions;
  }

  /** 获取上级部门选项 */
  async getParentOptions(): Promise<SelectOption[]> {
    const res = await $fetch<{ data: { parentOptions: SelectOption[] } }>(
      '/api/depts/options',
    );
    return res.data.parentOptions;
  }

  /** 创建部门 */
  async createDept(data: Omit<Dept, 'id' | 'createTime'>): Promise<Dept> {
    return $fetch<Dept>('/api/depts', { method: 'POST', body: data });
  }

  /** 更新部门 */
  async updateDept(id: string, data: Partial<Dept>): Promise<Dept> {
    return $fetch<Dept>(`/api/depts/${id}`, { method: 'PUT', body: data });
  }

  /** 删除单个部门 */
  async deleteDept(id: string): Promise<{ deletedCount: number }> {
    return $fetch<{ deletedCount: number }>(`/api/depts/${id}`, {
      method: 'DELETE',
    });
  }

  /** 批量删除部门 */
  async deleteDepts(ids: string[]): Promise<number> {
    const res = await $fetch<{ deleted: number }>('/api/depts/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return res.deleted;
  }
}
