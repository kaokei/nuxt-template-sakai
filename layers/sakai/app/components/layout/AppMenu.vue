<script setup>
import AppMenuItem from './AppMenuItem.vue';

const route = useRoute();

const model = ref([
  {
    label: 'Home',
    items: [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        to: '/demo',
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
      {
        label: 'Table',
        icon: 'pi pi-fw pi-table',
        to: '/demo/uikit/table',
      },
      {
        label: 'List',
        icon: 'pi pi-fw pi-list',
        to: '/demo/uikit/list',
      },
      {
        label: 'Tree',
        icon: 'pi pi-fw pi-share-alt',
        to: '/demo/uikit/tree',
      },
      {
        label: 'Panel',
        icon: 'pi pi-fw pi-tablet',
        to: '/demo/uikit/panel',
      },
      {
        label: 'Overlay',
        icon: 'pi pi-fw pi-clone',
        to: '/demo/uikit/overlay',
      },
      {
        label: 'Media',
        icon: 'pi pi-fw pi-image',
        to: '/demo/uikit/media',
      },
      {
        label: 'Menu',
        icon: 'pi pi-fw pi-bars',
        to: '/demo/uikit/menu',
      },
      {
        label: 'Message',
        icon: 'pi pi-fw pi-comment',
        to: '/demo/uikit/message',
      },
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        to: '/demo/uikit/file',
      },
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
      {
        label: 'Misc',
        icon: 'pi pi-fw pi-circle',
        to: '/demo/uikit/misc',
      },
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
      {
        label: 'Landing',
        icon: 'pi pi-fw pi-globe',
        to: '/demo/landing',
      },
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
        to: '/demo/pages/crud',
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
    label: 'Hierarchy',
    icon: 'pi pi-fw pi-align-left',
    path: '/hierarchy',
    items: [
      {
        label: 'Submenu 1',
        icon: 'pi pi-fw pi-align-left',
        path: '/submenu_1',
        items: [
          {
            label: 'Submenu 1.1',
            icon: 'pi pi-fw pi-align-left',
            path: '/submenu_1_1',
            items: [
              {
                label: 'Submenu 1.1.1',
                icon: 'pi pi-fw pi-align-left',
              },
              {
                label: 'Submenu 1.1.2',
                icon: 'pi pi-fw pi-align-left',
              },
              {
                label: 'Submenu 1.1.3',
                icon: 'pi pi-fw pi-align-left',
              },
            ],
          },
          {
            label: 'Submenu 1.2',
            icon: 'pi pi-fw pi-align-left',
            path: '/submenu_1_2',
            items: [
              {
                label: 'Submenu 1.2.1',
                icon: 'pi pi-fw pi-align-left',
              },
            ],
          },
        ],
      },
      {
        label: 'Submenu 2',
        icon: 'pi pi-fw pi-align-left',
        path: '/submenu_2',
        items: [
          {
            label: 'Submenu 2.1',
            icon: 'pi pi-fw pi-align-left',
            path: '/submenu_2_1',
            items: [
              {
                label: 'Submenu 2.1.1',
                icon: 'pi pi-fw pi-align-left',
              },
              {
                label: 'Submenu 2.1.2',
                icon: 'pi pi-fw pi-align-left',
              },
            ],
          },
          {
            label: 'Submenu 2.2',
            icon: 'pi pi-fw pi-align-left',
            path: '/submenu_2_2',
            items: [
              {
                label: 'Submenu 2.2.1',
                icon: 'pi pi-fw pi-align-left',
              },
            ],
          },
        ],
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
]);
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in model" :key="item">
      <app-menu-item
        v-if="!item.separator"
        :item="item"
        :index="i"
      ></app-menu-item>
      <li v-if="item.separator" class="menu-separator"></li>
    </template>
  </ul>
</template>

<style lang="scss" scoped></style>
