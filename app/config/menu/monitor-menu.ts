import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '系统监控',
    icon: 'pi pi-fw pi-desktop',
    items: [
      {
        label: '登录日志',
        icon: 'pi pi-fw pi-sign-in',
        to: '/monitor/login-log',
      },
      {
        label: '操作日志',
        icon: 'pi pi-fw pi-history',
        to: '/monitor/oper-log',
      },
      {
        label: '在线用户',
        icon: 'pi pi-fw pi-circle-fill',
        to: '/monitor/online-user',
      },
    ],
  },
];

export const monitorSystem: SystemConfig = {
  id: 'monitor',
  name: '系统监控',
  icon: 'pi pi-desktop',
  routePrefix: '/monitor',
  homeRoute: '/monitor/login-log',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
