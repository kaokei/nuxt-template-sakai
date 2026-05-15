import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '通知中心',
    icon: 'pi pi-fw pi-bell',
    items: [
      {
        label: '通知列表',
        icon: 'pi pi-fw pi-envelope',
        to: '/demo/notify/list',
      },
      {
        label: '公告管理',
        icon: 'pi pi-fw pi-megaphone',
        to: '/demo/notify/announce',
      },
    ],
  },
];

export const demoNotifyConfig: SystemConfig = {
  id: 'demo-notify',
  name: '通知中心',
  icon: 'pi pi-bell',
  routePrefix: '/demo/notify',
  homeRoute: '/demo/notify/list',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
