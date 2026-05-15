import type { MenuItem, SystemConfig } from '~/types/menu';

const demoMenuItems: MenuItem[] = [
  {
    label: 'Home',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        to: '/demo/workbench/workplace',
      },
    ],
  },
  {
    label: 'UI Components',
    path: '/uikit',
    items: [
      {
        label: 'Form Layout',
        icon: 'pi pi-fw pi-id-card',
        to: '/demo/uikit/formlayout',
      },
      {
        label: 'Input',
        icon: 'pi pi-fw pi-check-square',
        to: '/demo/uikit/input',
      },
      {
        label: 'Button',
        icon: 'pi pi-fw pi-mobile',
        to: '/demo/uikit/button',
        class: 'rotated-icon',
      },
      { label: 'Table', icon: 'pi pi-fw pi-table', to: '/demo/uikit/table' },
      { label: 'List', icon: 'pi pi-fw pi-list', to: '/demo/uikit/list' },
      { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/demo/uikit/tree' },
      { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/demo/uikit/panel' },
      {
        label: 'Overlay',
        icon: 'pi pi-fw pi-clone',
        to: '/demo/uikit/overlay',
      },
      { label: 'Media', icon: 'pi pi-fw pi-image', to: '/demo/uikit/media' },
      { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/demo/uikit/menu' },
      {
        label: 'Message',
        icon: 'pi pi-fw pi-comment',
        to: '/demo/uikit/message',
      },
      { label: 'File', icon: 'pi pi-fw pi-file', to: '/demo/uikit/file' },
      {
        label: 'Chart',
        icon: 'pi pi-fw pi-chart-bar',
        to: '/demo/uikit/charts',
      },
      {
        label: 'Timeline',
        icon: 'pi pi-fw pi-calendar',
        to: '/demo/uikit/timeline',
      },
      { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/demo/uikit/misc' },
    ],
  },
  {
    label: 'Prime Blocks',
    icon: 'pi pi-fw pi-prime',
    path: '/blocks',
    items: [
      {
        label: 'Free Blocks',
        icon: 'pi pi-fw pi-eye',
        to: '/demo/blocks/free',
      },
      {
        label: 'All Blocks',
        icon: 'pi pi-fw pi-globe',
        url: 'https://blocks.primevue.org/',
        target: '_blank',
      },
    ],
  },
  {
    label: 'Pages',
    icon: 'pi pi-fw pi-briefcase',
    path: '/pages',
    items: [
      { label: 'Landing', icon: 'pi pi-fw pi-globe', to: '/demo/landing' },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        path: '/auth',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/demo/auth/login',
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/demo/auth/error',
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/demo/auth/access',
          },
        ],
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        path: '/pages/crud',
        items: [
          {
            label: 'CRUD Demo',
            icon: 'pi pi-fw pi-pencil',
            to: '/demo/pages/crud',
          },
          {
            label: '题目管理',
            icon: 'pi pi-fw pi-list',
            to: '/demo/pages/crud/problem-mgr',
          },
        ],
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/demo/pages/notfound',
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/demo/pages/empty',
      },
    ],
  },
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
    ],
  },
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
  {
    label: 'Get Started',
    path: '/start',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        to: '/demo/start/documentation',
      },
      {
        label: 'View Source',
        icon: 'pi pi-fw pi-github',
        url: 'https://github.com/kaokei/nuxt-template-sakai',
        target: '_blank',
      },
    ],
  },
];

export const demoSystem: SystemConfig = {
  id: 'demo',
  name: '演示',
  icon: 'pi pi-palette',
  routePrefix: '/demo',
  homeRoute: '/demo/workbench/workplace',
  defaultLayout: 'sakai-sidebar',
  menuItems: demoMenuItems,
};
