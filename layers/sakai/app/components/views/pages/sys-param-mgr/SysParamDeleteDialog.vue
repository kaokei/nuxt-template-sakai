<script lang="ts" setup>
import type { SysParam } from '~/types/sys-param';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  mode: 'single' | 'batch';
  param: SysParam | null;
  batchCount: number;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const title = computed(() =>
  props.mode === 'batch' ? '批量删除确认' : '删除确认',
);

const message = computed(() => {
  if (props.mode === 'batch') {
    return `确定要删除选中的 ${props.batchCount} 个参数吗？此操作不可撤销。`;
  }
  if (props.param) {
    return `确定要删除参数「${props.param.name}」(${props.param.key}) 吗？此操作不可撤销。`;
  }
  return '确定要删除该参数吗？此操作不可撤销。';
});
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="title"
    :modal="true"
    :style="{ width: '480px' }"
    :draggable="false"
  >
    <div class="flex items-start gap-4">
      <i class="pi pi-exclamation-triangle text-3xl text-amber-500" />
      <span class="flex-1 text-sm">{{ message }}</span>
    </div>

    <template #footer>
      <PrimeButton
        label="取消"
        icon="pi pi-times"
        severity="secondary"
        text
        @click="visible = false"
      />
      <PrimeButton
        label="确认删除"
        icon="pi pi-trash"
        severity="danger"
        @click="emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>
