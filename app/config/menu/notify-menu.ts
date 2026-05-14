import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
  {
    label: '通知中心',
    icon: 'pi pi-fw pi-bell',
    items: [
      { label: '通知列表', icon: 'pi pi-fw pi-envelope', to: '/notify/list' },
      {
        label: '公告管理',
        icon: 'pi pi-fw pi-megaphone',
        to: '/notify/announce',
      },
    ],
  },
];

export const notifySystem: SystemConfig = {
  id: 'notify',
  name: '通知中心',
  icon: 'pi pi-bell',
  routePrefix: '/notify',
  homeRoute: '/notify/list',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
