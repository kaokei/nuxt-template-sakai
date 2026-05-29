<script lang="ts" setup>
import type { ShortLink } from '@sakai/types/short-link';

const visible = defineModel<boolean>('visible', { required: true });
const target = defineModel<ShortLink | null>('target', { default: null });
const count = defineModel<number>('count', { default: 0 });
const emit = defineEmits<{ confirm: [] }>();

const isBatch = computed(() => !target.value && count.value > 0);
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="删除确认"
    :modal="true"
    :style="{ width: '420px' }"
    :draggable="false"
  >
    <div class="flex items-center gap-3">
      <i class="pi pi-exclamation-triangle text-xl text-yellow-500" />
      <span v-if="isBatch"
        >确认删除选中的 <strong>{{ count }}</strong> 条短链？</span
      >
      <span v-else
        >确认删除短链
        <strong>"{{ target?.title }}"</strong> 吗？此操作不可恢复。</span
      >
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
