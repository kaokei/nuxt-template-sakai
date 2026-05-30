<script lang="ts" setup>
import type { Scene } from '@sakai/types/asset';

const visible = defineModel<boolean>('visible', { required: true });
const target = defineModel<Scene | null>('target', { default: null });
const emit = defineEmits<{ confirm: [] }>();
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="确认删除"
    :modal="true"
    :style="{ width: '460px' }"
    :draggable="false"
  >
    <div class="flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-xl text-yellow-500" />
      <div>
        <p>
          确认删除场景 <strong>"{{ target?.name }}"</strong>？
        </p>
        <p class="text-surface-500 mt-1 text-sm">
          该场景下有
          <strong>{{ target?.assetCount ?? 0 }}</strong>
          个素材，删除场景将同时删除所有素材文件，不可恢复。
        </p>
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton
        label="确认删除"
        severity="danger"
        @click="emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>
