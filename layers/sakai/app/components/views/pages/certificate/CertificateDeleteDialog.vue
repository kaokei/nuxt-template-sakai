<script lang="ts" setup>
defineProps<{
  visible: boolean;
  templateName: string;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  confirm: [];
}>();
</script>

<template>
  <PrimeDialog
    :visible="visible"
    header="确认删除"
    :modal="true"
    :closable="false"
    @update:visible="emit('update:visible', $event)"
  >
    <p>
      确定要删除模板"<strong>{{ templateName }}</strong
      >"吗？此操作不可撤销。
    </p>
    <template #footer>
      <PrimeButton
        label="取消"
        severity="secondary"
        outlined
        @click="emit('update:visible', false)"
      />
      <PrimeButton
        label="确认删除"
        severity="danger"
        @click="emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>
