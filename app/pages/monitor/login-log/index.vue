<script lang="ts" setup>
definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '登录日志' });
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">登录日志</h1>
    <p class="text-surface-500">用户登录记录、IP 地址、登录状态等审计信息。</p>
    <PrimeCard class="mt-4">
      <template #content>
        <p class="text-surface-400 py-8 text-center">功能开发中...</p>
      </template>
    </PrimeCard>
  </div>
</template>
