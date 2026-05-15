<script lang="ts" setup>
import type { DeptTreeNode } from '@sakai/services/DeptService';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  node: DeptTreeNode | null;
  batchCount: number;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const title = computed(() => (props.node ? '删除确认' : '批量删除确认'));

const message = computed(() => {
  if (props.node) {
    return `确定要删除部门「${props.node.data.name}」吗？其所有子部门也将被级联删除。此操作不可撤销。`;
  }
  return `确定要删除选中的 ${props.batchCount} 个部门及其子部门吗？此操作不可撤销。`;
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
