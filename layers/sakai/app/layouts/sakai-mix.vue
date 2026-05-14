<script setup>
import AppFooter from '@sakai/components/layout/AppFooter.vue';
import AppSidebar from '@sakai/components/layout/AppSidebar.vue';
import AppTopMenu from '@sakai/components/layout/AppTopMenu.vue';
import AppTopbar from '@sakai/components/layout/AppTopbar.vue';
import { useLayout } from '@sakai/components/layout/composables/layout';

const { layoutState, hideMobileMenu } = useLayout();
const menuService = useRootService(MenuService);
const route = useRoute();

const topMenuItems = computed(() => menuService.currentMenu);

const activeTopPath = computed(() => {
  const path = route.path;
  for (const item of topMenuItems.value) {
    if (item.to && path.startsWith(item.to)) return item.to;
    if (item.items) {
      for (const child of item.items) {
        if (child.to && path.startsWith(child.to))
          return item.path || item.to || '';
      }
    }
  }
  return '';
});

const sideMenuItems = computed(() => {
  const activeItem = topMenuItems.value.find(
    (item) => (item.path || item.to) === activeTopPath.value,
  );
  return activeItem?.items ?? [];
});
</script>

<template>
  <div class="layout-wrapper layout-mix">
    <AppTopbar />
    <AppTopMenu :items="topMenuItems" />
    <div class="layout-main-container layout-mix-main">
      <AppSidebar v-if="sideMenuItems.length > 0" :items="sideMenuItems" />
      <div class="layout-main">
        <slot></slot>
      </div>
    </div>
    <AppFooter />
  </div>
  <PrimeToast />
</template>
