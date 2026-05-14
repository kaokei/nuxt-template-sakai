<script lang="ts" setup>
definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '用户管理' });
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">用户管理</h1>
    <p class="text-surface-500">用户列表、新增、编辑、删除、导入导出等功能。</p>
    <PrimeCard class="mt-4">
      <template #content>
        <p class="text-surface-400 py-8 text-center">功能开发中...</p>
      </template>
    </PrimeCard>
  </div>
</template>
