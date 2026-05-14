<script lang="ts" setup>
import type { MenuItem } from '~/types/menu';
import AppMenuItem from './AppMenuItem.vue';

const props = defineProps<{
  items: MenuItem[];
}>();
</script>

<template>
  <ul class="layout-menu">
    <template v-for="(item, i) in props.items" :key="item.label">
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
