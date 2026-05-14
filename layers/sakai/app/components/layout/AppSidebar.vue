<script lang="ts" setup>
import { useLayout } from '@sakai/components/layout/composables/layout';
import type { MenuItem } from '~/types/menu';
import AppMenu from './AppMenu.vue';

const props = defineProps<{
  items?: MenuItem[];
}>();

const { layoutState, isDesktop, hasOpenOverlay } = useLayout();
const route = useRoute();
const sidebarRef = ref(null);
let outsideClickListener = null;

const menuService = useRootService(MenuService);
const currentMenu = computed(() => props.items ?? menuService.currentMenu);

watch(
  () => route.path,
  () => {
    layoutState.overlayMenuActive = false;
    layoutState.mobileMenuActive = false;
    layoutState.menuHoverActive = false;
  },
  { immediate: true },
);

watch(hasOpenOverlay, (newVal) => {
  if (isDesktop()) {
    if (newVal) bindOutsideClickListener();
    else unbindOutsideClickListener();
  }
});

const bindOutsideClickListener = () => {
  if (!outsideClickListener) {
    outsideClickListener = (event) => {
      if (isOutsideClicked(event)) {
        layoutState.overlayMenuActive = false;
      }
    };

    document.addEventListener('click', outsideClickListener);
  }
};

const unbindOutsideClickListener = () => {
  if (outsideClickListener) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener = null;
  }
};

const isOutsideClicked = (event) => {
  const topbarButtonEl = document.querySelector('.layout-menu-button');

  return !(
    sidebarRef.value.isSameNode(event.target) ||
    sidebarRef.value.contains(event.target) ||
    topbarButtonEl?.isSameNode(event.target) ||
    topbarButtonEl?.contains(event.target)
  );
};

onBeforeUnmount(() => {
  unbindOutsideClickListener();
});
</script>

<template>
  <div ref="sidebarRef" class="layout-sidebar">
    <AppMenu :items="currentMenu" />
  </div>
</template>
