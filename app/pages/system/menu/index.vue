<script lang="ts" setup>
definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '菜单管理' });
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">菜单管理</h1>
    <p class="text-surface-500">
      菜单树形 CRUD、图标选择、路由配置、拖拽排序等功能。
    </p>
    <PrimeCard class="mt-4">
      <template #content>
        <p class="text-surface-400 py-8 text-center">功能开发中...</p>
      </template>
    </PrimeCard>
  </div>
</template>
