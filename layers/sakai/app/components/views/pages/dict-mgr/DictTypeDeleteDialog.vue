<script lang="ts" setup>
import type { DictType } from '@sakai/services/DictService';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  mode: 'single' | 'batch';
  type: DictType | null;
  dataCount: number;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const title = computed(() =>
  props.mode === 'batch' ? '批量删除字典类型' : '删除字典类型',
);

const message = computed(() => {
  if (props.mode === 'batch') {
    return `确定要删除选中的 ${props.dataCount} 个字典类型吗？此操作不可撤销。`;
  }
  if (props.type) {
    return `确定要删除字典类型「${props.type.name}」(${props.type.code}) 吗？此操作不可撤销。`;
  }
  return '确定要删除该字典类型吗？此操作不可撤销。';
});

const showDataWarning = computed(() => props.dataCount > 0);
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="title"
    :modal="true"
    :style="{ width: '480px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-3">
      <div class="flex items-start gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-amber-500" />
        <span class="flex-1 text-sm">{{ message }}</span>
      </div>
      <div v-if="showDataWarning" class="text-sm text-red-500">
        ⚠️ 该类型下的 {{ dataCount }} 条字典数据将同时被删除
      </div>
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
