<script lang="ts" setup>
import { AnnouncementService } from '@sakai/services/AnnouncementService';
import type { Announcement } from '~/types/announcement';

declareProviders([AnnouncementService]);

const service = useService(AnnouncementService);

definePageMeta({ layout: 'sakai-consumer' });
useSeoMeta({ title: '公告栏' });

const announcements = ref<Announcement[]>([]);
const loading = ref(false);
const totalRecords = ref(0);

const dateFormat = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

async function loadAnnouncements() {
  loading.value = true;
  try {
    const result = await service.queryPublishedAnnouncements();
    announcements.value = result.data;
    totalRecords.value = result.total;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadAnnouncements();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="card p-6!">
      <h1 class="text-2xl font-bold">公告栏</h1>
    </div>

    <div v-if="loading" class="card p-12! text-center">
      <i class="pi pi-spin pi-spinner text-surface-400 text-2xl" />
    </div>

    <div
      v-else-if="announcements.length === 0"
      class="card text-surface-500 p-12! text-center"
    >
      暂无公告
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="item in announcements"
        :key="item.id"
        class="card cursor-pointer p-5! transition-shadow hover:shadow-md"
        :class="{ 'border-l-primary border-l-4': item.isPinned }"
        @click="navigateTo(`/demo/notices/${item.id}`)"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0 flex-1">
            <div class="mb-2 flex items-center gap-2">
              <PrimeTag v-if="item.isPinned" value="置顶" severity="warn" />
              <h2 class="truncate text-lg font-semibold">{{ item.title }}</h2>
            </div>
            <p class="text-surface-500 line-clamp-2 text-sm">
              {{
                item.summary ||
                item.content.replace(/<[^>]*>/g, '').slice(0, 150)
              }}
            </p>
          </div>
          <div class="text-surface-400 pt-1 text-xs whitespace-nowrap">
            {{ dateFormat(item.publishedAt || item.createdAt) }}
          </div>
        </div>
      </div>

      <div
        v-if="totalRecords > announcements.length"
        class="text-surface-400 py-2 text-center text-sm"
      >
        共 {{ totalRecords }} 条公告
      </div>
    </div>
  </div>
</template>
