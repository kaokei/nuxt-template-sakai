<script lang="ts" setup>
import { AnnouncementService } from '@sakai/services/AnnouncementService';
import type { Announcement } from '~/types/announcement';

declareProviders([AnnouncementService]);

const service = useService(AnnouncementService);
const route = useRoute();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '公告详情' });

const announcement = ref<Announcement | null>(null);
const loading = ref(true);

const dateFormat = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

onMounted(async () => {
  try {
    const id = route.params.id as string;
    const result = await service.getAnnouncement(id);
    announcement.value = result.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-if="loading" class="card p-12! text-center">
      <i class="pi pi-spin pi-spinner text-surface-400 text-2xl" />
    </div>

    <div
      v-else-if="!announcement"
      class="card text-surface-500 p-12! text-center"
    >
      公告不存在或已下架
    </div>

    <div v-else class="card p-6!">
      <PrimeButton
        label="返回公告列表"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        class="mb-4"
        @click="navigateTo('/notices')"
      />

      <article>
        <h1 class="mb-2 text-2xl font-bold">{{ announcement.title }}</h1>
        <div class="text-surface-500 mb-6 flex items-center gap-3 text-sm">
          <span
            >{{
              dateFormat(announcement.publishedAt || announcement.createdAt)
            }}
            发布</span
          >
          <span v-if="announcement.viewCount"
            >阅读 {{ announcement.viewCount }} 次</span
          >
        </div>
        <div class="border-surface border-t pt-6">
          <div class="prose max-w-none" v-html="announcement.content" />
        </div>
      </article>
    </div>
  </div>
</template>
