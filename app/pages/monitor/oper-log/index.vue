<script lang="ts" setup>
definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '操作日志' });
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">操作日志</h1>
    <p class="text-surface-500">用户操作记录、请求参数、响应结果等审计信息。</p>
    <PrimeCard class="mt-4">
      <template #content>
        <p class="text-surface-400 py-8 text-center">功能开发中...</p>
      </template>
    </PrimeCard>
  </div>
</template>
