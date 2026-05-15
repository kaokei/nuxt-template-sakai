<script lang="ts" setup>
import type { DictData } from '@sakai/services/DictService';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  data: DictData | null;
}>();

const emit = defineEmits<{
  confirm: [];
}>();

const message = computed(() => {
  if (props.data) {
    return `确定要删除字典数据「${props.data.label}」(${props.data.value}) 吗？删除后不可恢复。`;
  }
  return '确定要删除该字典数据吗？删除后不可恢复。';
});
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="删除字典数据"
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
