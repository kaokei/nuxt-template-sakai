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
      {
        label: '岗位管理',
        icon: 'pi pi-fw pi-id-card',
        to: '/demo/system/post',
      },
      { label: '字典管理', icon: 'pi pi-fw pi-book', to: '/demo/system/dict' },
      {
        label: '参数配置',
        icon: 'pi pi-fw pi-sliders-h',
        to: '/demo/system/sys-param',
      },
      {
        label: '功能开关',
        icon: 'pi pi-fw pi-flag',
        to: '/demo/system/feature-flag',
      },
      {
        label: '区号管理',
        icon: 'pi pi-fw pi-globe',
        to: '/demo/system/area-code',
      },
      { label: '定时任务', icon: 'pi pi-fw pi-clock', to: '/demo/system/job' },
      {
        label: '数据备份',
        icon: 'pi pi-fw pi-database',
        to: '/demo/system/backup',
      },
      {
        label: '短链工具',
        icon: 'pi pi-fw pi-link',
        to: '/demo/system/short-link',
      },
      {
        label: '素材管理',
        icon: 'pi pi-fw pi-folder-open',
        to: '/demo/system/asset',
      },
      {
        label: '模板合成',
        icon: 'pi pi-fw pi-images',
        to: '/demo/system/certificate',
      },
      {
        label: '小程序工具',
        icon: 'pi pi-fw pi-qrcode',
        to: '/demo/system/miniapp',
      },
    ],
  },
  {
    label: '系统监控',
    icon: 'pi pi-fw pi-desktop',
    items: [
      {
        label: '登录日志',
        icon: 'pi pi-fw pi-sign-in',
        to: '/demo/system/monitor/login-log',
      },
      {
        label: '操作日志',
        icon: 'pi pi-fw pi-history',
        to: '/demo/system/monitor/oper-log',
      },
      {
        label: '在线用户',
        icon: 'pi pi-fw pi-circle-fill',
        to: '/demo/system/monitor/online-user',
      },
      {
        label: '数据监控',
        icon: 'pi pi-fw pi-database',
        to: '/demo/system/monitor/data',
      },
      {
        label: '服务监控',
        icon: 'pi pi-fw pi-server',
        to: '/demo/system/monitor/server',
      },
      {
        label: '缓存监控',
        icon: 'pi pi-fw pi-cloud',
        to: '/demo/system/monitor/cache',
      },
      {
        label: '缓存列表',
        icon: 'pi pi-fw pi-list',
        to: '/demo/system/monitor/cache-list',
      },
    ],
  },
  {
    label: '通知中心',
    icon: 'pi pi-fw pi-bell',
    items: [
      {
        label: '通知管理',
        icon: 'pi pi-fw pi-envelope',
        to: '/demo/system/notify/list',
      },
      {
        label: '公告管理',
        icon: 'pi pi-fw pi-megaphone',
        to: '/demo/system/notify/announce',
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
