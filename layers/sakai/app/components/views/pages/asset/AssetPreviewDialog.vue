<script lang="ts" setup>
import type { Asset } from '@sakai/types/asset';

const visible = defineModel<boolean>('visible', { required: true });
const asset = defineModel<Asset | null>('asset', { default: null });

const canPreview = computed(() => {
  if (!asset.value) return false;
  const mime = asset.value.mimeType;
  return (
    mime.startsWith('image/') ||
    mime.startsWith('video/') ||
    mime.startsWith('audio/') ||
    mime === 'application/pdf' ||
    mime.startsWith('text/')
  );
});

const previewType = computed(() => {
  if (!asset.value) return 'other';
  const mime = asset.value.mimeType;
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (mime === 'application/pdf') return 'pdf';
  if (mime.startsWith('text/')) return 'text';
  return 'other';
});

async function copyLink(): Promise<void> {
  if (!asset.value) return;
  const { default: copy } = await import('copy-to-clipboard');
  copy(asset.value.url);
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="'预览：' + asset?.fileName"
    :modal="true"
    :style="{ width: '720px' }"
    :draggable="false"
    :maximizable="true"
  >
    <div v-if="asset" class="flex flex-col gap-4">
      <div
        class="bg-surface-50 flex min-h-[300px] items-center justify-center rounded-lg"
      >
        <img
          v-if="previewType === 'image'"
          :src="asset.url"
          :alt="asset.fileName"
          class="max-h-[400px] max-w-full object-contain"
        />
        <video
          v-else-if="previewType === 'video'"
          :src="asset.url"
          controls
          class="max-h-[400px] max-w-full"
        />
        <audio
          v-else-if="previewType === 'audio'"
          :src="asset.url"
          controls
          class="w-full"
        />
        <iframe
          v-else-if="previewType === 'pdf'"
          :src="asset.url"
          class="h-[500px] w-full rounded border"
        />
        <pre
          v-else-if="previewType === 'text'"
          class="max-h-[400px] max-w-full overflow-auto p-4 text-sm whitespace-pre-wrap"
          >{{ asset.url }}</pre
        >
        <div
          v-else
          class="text-surface-500 flex flex-col items-center gap-3 py-8"
        >
          <i class="pi pi-file text-5xl" />
          <p class="text-sm">{{ asset.mimeType }}</p>
          <p class="text-xs">此文件类型不支持在线预览</p>
          <a
            :href="asset.url"
            target="_blank"
            class="text-primary hover:underline"
            >打开原文件</a
          >
        </div>
      </div>

      <div class="bg-surface-50 flex items-center gap-2 rounded-lg p-3">
        <span class="text-surface-600 min-w-0 flex-1 truncate text-sm">{{
          asset.url
        }}</span>
        <PrimeButton
          icon="pi pi-copy"
          severity="secondary"
          size="small"
          @click="copyLink"
        />
      </div>
    </div>
  </PrimeDialog>
</template>
