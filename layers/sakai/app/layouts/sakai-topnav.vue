<script setup>
import AppFooter from '@sakai/components/layout/AppFooter.vue';
import AppTopMenu from '@sakai/components/layout/AppTopMenu.vue';
import AppTopbar from '@sakai/components/layout/AppTopbar.vue';
import { MenuService } from '~/services/menu.service';

const menuService = useRootService(MenuService);
const currentMenu = computed(() => menuService.currentMenu);
</script>

<template>
  <div class="layout-wrapper layout-topnav">
    <AppTopbar />
    <AppTopMenu :items="currentMenu" />
    <div class="layout-main-container">
      <div class="layout-main">
        <slot></slot>
      </div>
      <AppFooter />
    </div>
  </div>
  <PrimeToast />
</template>
