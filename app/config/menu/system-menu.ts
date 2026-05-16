import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '系统管理',
    icon: 'pi pi-fw pi-cog',
    items: [
      { label: '用户管理', icon: 'pi pi-fw pi-user', to: '/demo/system/user' },
      { label: '角色管理', icon: 'pi pi-fw pi-users', to: '/demo/system/role' },
      { label: '菜单管理', icon: 'pi pi-fw pi-bars', to: '/demo/system/menu' },
      {
        label: '部门管理',
        icon: 'pi pi-fw pi-sitemap',
        to: '/demo/system/dept',
      },
      { label: '字典管理', icon: 'pi pi-fw pi-book', to: '/demo/system/dict' },
      {
        label: '功能开关',
        icon: 'pi pi-fw pi-flag',
        to: '/demo/system/feature-flag',
      },
    ],
  },
];

export const demoSystemConfig: SystemConfig = {
  id: 'demo-system',
  name: '系统管理',
  icon: 'pi pi-cog',
  routePrefix: '/demo/system',
  homeRoute: '/demo/system/user',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
