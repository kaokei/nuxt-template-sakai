import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '系统监控',
    icon: 'pi pi-fw pi-desktop',
    items: [
      {
        label: '登录日志',
        icon: 'pi pi-fw pi-sign-in',
        to: '/demo/monitor/login-log',
      },
      {
        label: '操作日志',
        icon: 'pi pi-fw pi-history',
        to: '/demo/monitor/oper-log',
      },
      {
        label: '在线用户',
        icon: 'pi pi-fw pi-circle-fill',
        to: '/demo/monitor/online-user',
      },
    ],
  },
];

export const demoMonitorConfig: SystemConfig = {
  id: 'demo-monitor',
  name: '系统监控',
  icon: 'pi pi-desktop',
  routePrefix: '/demo/monitor',
  homeRoute: '/demo/monitor/login-log',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
