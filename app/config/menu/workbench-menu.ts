import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '工作台',
    icon: 'pi pi-fw pi-chart-bar',
    items: [
      {
        label: '分析页',
        icon: 'pi pi-fw pi-chart-line',
        to: '/demo/workbench/analysis',
      },
      {
        label: '工作台',
        icon: 'pi pi-fw pi-th-large',
        to: '/demo/workbench/workplace',
      },
    ],
  },
];

export const demoWorkbenchConfig: SystemConfig = {
  id: 'demo-workbench',
  name: '工作台',
  icon: 'pi pi-chart-bar',
  routePrefix: '/demo/workbench',
  homeRoute: '/demo/workbench/workplace',
  defaultLayout: 'sakai-topnav',
  menuItems,
};
