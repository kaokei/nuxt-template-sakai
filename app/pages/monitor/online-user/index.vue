<script lang="ts" setup>
definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '在线用户' });
</script>

<template>
  <div class="p-6">
    <h1 class="mb-4 text-2xl font-bold">在线用户</h1>
    <p class="text-surface-500">当前在线用户列表、会话管理、强制下线等功能。</p>
    <PrimeCard class="mt-4">
      <template #content>
        <p class="text-surface-400 py-8 text-center">功能开发中...</p>
      </template>
    </PrimeCard>
  </div>
</template>
