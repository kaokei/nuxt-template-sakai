<script lang="ts" setup>
import QRCode from 'qrcode';
import type { ShortLink } from '@sakai/types/short-link';

const visible = defineModel<boolean>('visible', { required: true });
const data = defineModel<ShortLink | null>('data', { default: null });

const qrDataUrl = ref('');
const fullUrl = computed(() =>
  data.value ? `https://t.cn/${data.value.shortCode}` : '',
);

watch(visible, async (isVisible) => {
  if (isVisible && fullUrl.value) {
    qrDataUrl.value = await QRCode.toDataURL(fullUrl.value, {
      width: 256,
      margin: 2,
    });
  }
});

function downloadPNG(): void {
  const link = document.createElement('a');
  link.download = `${data.value?.shortCode || 'qrcode'}.png`;
  link.href = qrDataUrl.value;
  link.click();
}

async function copyUrl(): Promise<void> {
  const { default: copy } = await import('copy-to-clipboard');
  copy(fullUrl.value);
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="短链二维码"
    :modal="true"
    :style="{ width: '380px' }"
    :draggable="false"
  >
    <div class="flex flex-col items-center gap-4">
      <img
        v-if="qrDataUrl"
        :src="qrDataUrl"
        alt="QR Code"
        class="border-surface-200 dark:border-surface-700 rounded border"
        width="200"
        height="200"
      />
      <div class="text-surface-500 dark:text-surface-400 text-sm">
        {{ data?.title }}
      </div>
      <div class="text-primary font-mono text-sm">
        {{ fullUrl }}
      </div>
      <div class="flex gap-2">
        <PrimeButton
          label="下载 PNG"
          icon="pi pi-download"
          size="small"
          severity="secondary"
          @click="downloadPNG"
        />
        <PrimeButton
          label="复制链接"
          icon="pi pi-copy"
          size="small"
          @click="copyUrl"
        />
      </div>
    </div>
  </PrimeDialog>
</template>
