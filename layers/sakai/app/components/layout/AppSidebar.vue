<script lang="ts" setup>
import { useLayout } from '@sakai/components/layout/composables/layout';
import { MenuService } from '~/services/menu.service';
import type { MenuItem } from '~/types/menu';
import AppMenu from './AppMenu.vue';

const props = defineProps<{
  items?: MenuItem[];
}>();

const { layoutState, isDesktop, hasOpenOverlay } = useLayout();
const route = useRoute();
const sidebarRef = ref<HTMLElement | null>(null);
let outsideClickListener: ((e: MouseEvent) => void) | null = null;

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
    outsideClickListener = (e: MouseEvent) => {
      if (isOutsideClicked(e)) {
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

const isOutsideClicked = (event: MouseEvent) => {
  const topbarButtonEl = document.querySelector('.layout-menu-button');

  return !(
    sidebarRef.value?.isSameNode(event.target as Node) ||
    sidebarRef.value?.contains(event.target as Node) ||
    topbarButtonEl?.isSameNode(event.target as Node) ||
    topbarButtonEl?.contains(event.target as Node)
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
