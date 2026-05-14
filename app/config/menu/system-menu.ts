import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '系统管理',
    icon: 'pi pi-fw pi-cog',
    items: [
      { label: '用户管理', icon: 'pi pi-fw pi-user', to: '/system/user' },
      { label: '角色管理', icon: 'pi pi-fw pi-users', to: '/system/role' },
      { label: '菜单管理', icon: 'pi pi-fw pi-bars', to: '/system/menu' },
      { label: '部门管理', icon: 'pi pi-fw pi-sitemap', to: '/system/dept' },
      { label: '字典管理', icon: 'pi pi-fw pi-book', to: '/system/dict' },
    ],
  },
];

export const systemManageSystem: SystemConfig = {
  id: 'system',
  name: '系统管理',
  icon: 'pi pi-cog',
  routePrefix: '/system',
  homeRoute: '/system/user',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
