// ==================== 菜单接口定义 ====================

export interface Menu {
  id: string;
  name: string;
  parentId: string | null;
  type: 'directory' | 'menu' | 'button';
  icon: string;
  order: number;
  route: string;
  component: string;
  permission: string;
  external: boolean;
  cache: boolean;
  visible: boolean;
  status: 'active' | 'inactive';
  createTime: string;
}

/** PrimeTreeTable 使用的树节点 */
export interface MenuTreeNode {
  key: string;
  data: Menu;
  children?: MenuTreeNode[];
  // 展平显示字段
  name: string;
  type: string;
  order: number;
  route: string;
  permission: string;
  visible: boolean;
  status: string;
  createTime: string;
  icon: string;
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

// ==================== 菜单数据服务 ====================

@Injectable()
export class MenuAdminService {
  /** 查询菜单列表（扁平数组） */
  async queryMenus(keyword?: string): Promise<Menu[]> {
    const query: Record<string, string> = {};
    if (keyword) {
      query.keyword = keyword;
    }
    const res = await $fetch<{ data: Menu[] }>('/api/menus', { query });
    return res.data;
  }

  /** 根据 ID 获取单个菜单 */
  async getMenuById(id: string): Promise<Menu | undefined> {
    try {
      return await $fetch<Menu>(`/api/menus/${id}`);
    } catch {
      return undefined;
    }
  }

  /** 获取上级菜单选项 */
  async getParentOptions(): Promise<SelectOption[]> {
    const res = await $fetch<{ data: { parentOptions: SelectOption[] } }>(
      '/api/menus/options',
    );
    return res.data.parentOptions;
  }

  /** 创建菜单 */
  async createMenu(data: Omit<Menu, 'id' | 'createTime'>): Promise<Menu> {
    return $fetch<Menu>('/api/menus', { method: 'POST', body: data });
  }

  /** 更新菜单 */
  async updateMenu(id: string, data: Partial<Menu>): Promise<Menu> {
    return $fetch<Menu>(`/api/menus/${id}`, { method: 'PUT', body: data });
  }

  /** 删除单个菜单 */
  async deleteMenu(id: string): Promise<{ deletedCount: number }> {
    return $fetch<{ deletedCount: number }>(`/api/menus/${id}`, {
      method: 'DELETE',
    });
  }

  /** 批量删除菜单 */
  async deleteMenus(ids: string[]): Promise<number> {
    const res = await $fetch<{ deleted: number }>('/api/menus/batch-delete', {
      method: 'POST',
      body: { ids },
    });
    return res.deleted;
  }
}
