import type { MenuItem, SystemConfig } from '~/types/menu';

const menuItems: MenuItem[] = [
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
    path: '/showcase/uikit',
    items: [
      {
        label: 'Form Layout',
        icon: 'pi pi-fw pi-id-card',
        to: '/demo/showcase/uikit/formlayout',
      },
      {
        label: 'Input',
        icon: 'pi pi-fw pi-check-square',
        to: '/demo/showcase/uikit/input',
      },
      {
        label: 'Button',
        icon: 'pi pi-fw pi-mobile',
        to: '/demo/showcase/uikit/button',
        class: 'rotated-icon',
      },
      {
        label: 'Table',
        icon: 'pi pi-fw pi-table',
        to: '/demo/showcase/uikit/table',
      },
      {
        label: 'List',
        icon: 'pi pi-fw pi-list',
        to: '/demo/showcase/uikit/list',
      },
      {
        label: 'Tree',
        icon: 'pi pi-fw pi-share-alt',
        to: '/demo/showcase/uikit/tree',
      },
      {
        label: 'Panel',
        icon: 'pi pi-fw pi-tablet',
        to: '/demo/showcase/uikit/panel',
      },
      {
        label: 'Overlay',
        icon: 'pi pi-fw pi-clone',
        to: '/demo/showcase/uikit/overlay',
      },
      {
        label: 'Media',
        icon: 'pi pi-fw pi-image',
        to: '/demo/showcase/uikit/media',
      },
      {
        label: 'Menu',
        icon: 'pi pi-fw pi-bars',
        to: '/demo/showcase/uikit/menu',
      },
      {
        label: 'Message',
        icon: 'pi pi-fw pi-comment',
        to: '/demo/showcase/uikit/message',
      },
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        to: '/demo/showcase/uikit/file',
      },
      {
        label: 'Chart',
        icon: 'pi pi-fw pi-chart-bar',
        to: '/demo/showcase/uikit/charts',
      },
      {
        label: 'Timeline',
        icon: 'pi pi-fw pi-calendar',
        to: '/demo/showcase/uikit/timeline',
      },
      {
        label: 'Misc',
        icon: 'pi pi-fw pi-circle',
        to: '/demo/showcase/uikit/misc',
      },
    ],
  },
  {
    label: 'Prime Blocks',
    icon: 'pi pi-fw pi-prime',
    path: '/showcase/blocks',
    items: [
      {
        label: 'Free Blocks',
        icon: 'pi pi-fw pi-eye',
        to: '/demo/showcase/blocks/free',
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
    path: '/showcase/pages',
    items: [
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/demo/showcase/landing',
      },
      {
        label: 'Auth',
        icon: 'pi pi-fw pi-user',
        path: '/showcase/auth',
        items: [
          {
            label: 'Login',
            icon: 'pi pi-fw pi-sign-in',
            to: '/demo/showcase/auth/login',
          },
          {
            label: 'Error',
            icon: 'pi pi-fw pi-times-circle',
            to: '/demo/showcase/auth/error',
          },
          {
            label: 'Access Denied',
            icon: 'pi pi-fw pi-lock',
            to: '/demo/showcase/auth/access',
          },
        ],
      },
      {
        label: 'Crud',
        icon: 'pi pi-fw pi-pencil',
        path: '/showcase/pages/crud',
        items: [
          {
            label: 'CRUD Demo',
            icon: 'pi pi-fw pi-pencil',
            to: '/demo/showcase/pages/crud',
          },
          {
            label: '题目管理',
            icon: 'pi pi-fw pi-list',
            to: '/demo/showcase/pages/crud/problem-mgr',
          },
        ],
      },
      {
        label: 'Not Found',
        icon: 'pi pi-fw pi-exclamation-circle',
        to: '/demo/showcase/pages/notfound',
      },
      {
        label: 'Empty',
        icon: 'pi pi-fw pi-circle-off',
        to: '/demo/showcase/pages/empty',
      },
    ],
  },
  {
    label: 'Get Started',
    path: '/showcase/start',
    items: [
      {
        label: 'Documentation',
        icon: 'pi pi-fw pi-book',
        to: '/demo/showcase/start/documentation',
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

export const demoShowcaseConfig: SystemConfig = {
  id: 'demo-showcase',
  name: 'UI 展示',
  icon: 'pi pi-palette',
  routePrefix: '/demo/showcase',
  homeRoute: '/demo/showcase/uikit/button',
  defaultLayout: 'sakai-sidebar',
  menuItems,
};
