import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '工作台',
    icon: 'pi pi-fw pi-chart-bar',
    items: [
      {
        label: '分析页',
        icon: 'pi pi-fw pi-chart-line',
        to: '/dashboard/analysis',
      },
      {
        label: '工作台',
        icon: 'pi pi-fw pi-th-large',
        to: '/dashboard/workplace',
      },
    ],
  },
];

export const dashboardSystem: SystemConfig = {
  id: 'dashboard',
  name: '工作台',
  icon: 'pi pi-chart-bar',
  routePrefix: '/dashboard',
  homeRoute: '/dashboard/analysis',
  defaultLayout: 'sakai-topnav',
  menuItems,
};
