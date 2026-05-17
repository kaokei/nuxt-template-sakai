import type { MenuItem, SystemConfig } from '~/types/menu';

interface MinimalRouter {
  push: (url: string) => void;
}

@Injectable()
export class MenuService {
  systems: SystemConfig[] = [];
  currentSystemId = '';

  /** 当前用户的权限列表，用于菜单过滤 */
  private _currentPermissions: string[] = [];

  get currentSystem(): SystemConfig | null {
    return this.systems.find((s) => s.id === this.currentSystemId) ?? null;
  }

  /** 完整的未过滤菜单（管理员用途） */
  get currentMenu() {
    return this.currentSystem?.menuItems ?? [];
  }

  get currentLayout() {
    return (this.currentSystem?.defaultLayout ?? 'sakai-sidebar') as
      | 'sakai-sidebar'
      | 'sakai-topnav'
      | 'sakai-mix';
  }

  registerSystems(configs: SystemConfig[], currentRoute?: string) {
    this.systems = configs;
    if (currentRoute) {
      this.matchRoute(currentRoute);
    } else if (!this.currentSystemId && configs[0]) {
      this.currentSystemId = configs[0].id;
    }
  }

  matchRoute(currentRoute: string) {
    if (this.systems.length === 0) return;
    const sorted = [...this.systems].sort(
      (a, b) => b.routePrefix.length - a.routePrefix.length,
    );
    const matched = sorted.find((s) => currentRoute.startsWith(s.routePrefix));
    if (matched) {
      this.currentSystemId = matched.id;
    }
  }

  switchSystem(systemId: string, router?: MinimalRouter) {
    const system = this.systems.find((s) => s.id === systemId);
    if (!system) return;
    this.currentSystemId = systemId;
    if (router) {
      router.push(system.homeRoute);
    }
  }

  // ==================== 权限过滤 ====================

  /**
   * 存储当前用户的权限列表
   * 设置后可通过 getFilteredMenus() 无参调用自动使用
   */
  setCurrentPermissions(permissions: string[]) {
    this._currentPermissions = permissions;
  }

  /**
   * 根据用户权限过滤当前系统菜单
   *
   * 过滤规则：
   * 1. 菜单项没有 permission 属性（或值为空字符串）→ 始终可见
   * 2. 菜单项有 permission 属性 → 值必须在 userPermissions 中才可见
   * 3. 有子菜单的父节点：如果所有子节点都被过滤掉，父节点也隐藏
   * 4. visible: false 的菜单项会被移除
   *
   * @param userPermissions - 用户的权限标识符列表，不传则使用 setCurrentPermissions 设置的值
   * @returns 过滤后的菜单项列表，结构与 MenuItem[] 一致
   */
  getFilteredMenus(userPermissions?: string[]): MenuItem[] {
    const permissions = userPermissions ?? this._currentPermissions;
    if (!permissions || permissions.length === 0) {
      return this.currentMenu;
    }
    return this._filterItemsByPermission(this.currentMenu, permissions);
  }

  /**
   * 对任意菜单数组进行权限过滤（提供给侧边栏等组件使用）
   * 过滤规则与 getFilteredMenus 一致
   */
  filterMenuByPermission(items: MenuItem[], permissions: string[]): MenuItem[] {
    if (!permissions || permissions.length === 0) {
      return items;
    }
    return this._filterItemsByPermission(items, permissions);
  }

  /**
   * 递归过滤菜单项（内部方法）
   */
  private _filterItemsByPermission(
    items: MenuItem[],
    permissions: string[],
  ): MenuItem[] {
    return items
      .filter((item) => item.visible !== false)
      .map((item) => {
        // 有子菜单：递归过滤子菜单
        if (item.items && item.items.length > 0) {
          const filteredChildren = this._filterItemsByPermission(
            item.items,
            permissions,
          );
          // 所有子菜单都被过滤 → 父菜单也隐藏
          if (filteredChildren.length === 0) return null;
          return { ...item, items: filteredChildren };
        }

        // 叶子节点：检查 permission 属性
        // 注意：MenuItem 类型未定义 permission 字段，通过索引访问运行时属性
        const permission = (item as unknown as Record<string, unknown>)
          .permission as string | undefined;
        if (!permission) return item; // 无权限要求 → 始终可见
        if (permissions.includes(permission)) return item; // 有权限 → 可见

        return null; // 无权限 → 隐藏
      })
      .filter((item): item is MenuItem => item !== null);
  }
}
