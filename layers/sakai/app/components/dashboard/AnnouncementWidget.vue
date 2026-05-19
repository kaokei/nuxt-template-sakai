<script lang="ts" setup>
import type { Announcement } from '~/types/announcement';

const announcements = ref<Announcement[]>([]);
const loading = ref(true);

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getMonth() + 1}-${d.getDate()}`;
};

onMounted(async () => {
  try {
    const result = await $fetch<{ data: Announcement[]; total: number }>(
      '/api/announcements/published',
      { query: { limit: '3' } },
    );
    announcements.value = result.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="card">
    <div class="mb-4 flex items-center justify-between">
      <div class="text-xl font-semibold">最新公告</div>
      <router-link
        to="/demo/notices"
        class="text-primary text-sm hover:underline"
      >
        查看全部
      </router-link>
    </div>

    <div v-if="loading" class="text-surface-400 py-4 text-center text-sm">
      加载中...
    </div>
    <div
      v-else-if="announcements.length === 0"
      class="text-surface-400 py-4 text-center text-sm"
    >
      暂无公告
    </div>
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="item in announcements"
        :key="item.id"
        class="group cursor-pointer"
        @click="navigateTo(`/demo/notices/${item.id}`)"
      >
        <div class="flex items-start gap-2">
          <div class="mt-0.5 shrink-0">
            <i
              :class="
                item.isPinned
                  ? 'pi pi-thumbtack text-orange-400'
                  : 'pi pi-volume-up text-blue-400'
              "
              class="text-xs"
            />
          </div>
          <div class="min-w-0 flex-1">
            <div
              class="group-hover:text-primary truncate text-sm font-medium transition-colors"
            >
              {{ item.title }}
            </div>
            <div class="text-surface-400 mt-0.5 text-xs">
              {{ formatDate(item.publishedAt || item.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
