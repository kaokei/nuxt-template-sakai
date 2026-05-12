<script lang="ts" setup>
import type { Problem } from '@sakai/services/ProblemService';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  mode: 'single' | 'batch';
  problem: Problem | null;
  batchCount: number;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const title = computed(() =>
  props.mode === 'batch' ? `批量删除确认` : '删除确认',
);

const message = computed(() => {
  if (props.mode === 'batch') {
    return `确定要删除选中的 ${props.batchCount} 道题目吗？此操作不可撤销。`;
  }
  if (props.problem) {
    return `确定要删除题目「${props.problem.title}」(${props.problem.problemNumber}) 吗？此操作不可撤销。`;
  }
  return '确定要删除该题目吗？此操作不可撤销。';
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
