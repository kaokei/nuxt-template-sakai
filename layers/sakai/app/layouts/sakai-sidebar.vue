<script setup>
import AppFooter from '@sakai/components/layout/AppFooter.vue';
import AppSidebar from '@sakai/components/layout/AppSidebar.vue';
import AppTopbar from '@sakai/components/layout/AppTopbar.vue';
import { useLayout } from '@sakai/components/layout/composables/layout';

const { layoutConfig, layoutState, hideMobileMenu } = useLayout();

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.mobileMenuActive,
    'layout-static-inactive': layoutState.staticMenuInactive,
  };
});
</script>

<template>
  <div class="layout-wrapper" :class="containerClass">
    <AppTopbar />
    <AppSidebar />
    <div class="layout-main-container">
      <div class="layout-main">
        <slot></slot>
      </div>
      <AppFooter />
    </div>
    <div class="layout-mask animate-fadein" @click="hideMobileMenu" />
  </div>
  <PrimeToast />
</template>
