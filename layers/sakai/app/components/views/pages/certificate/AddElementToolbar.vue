<script lang="ts" setup>
const emit = defineEmits<{
  addText: [];
  addImage: [];
}>();
</script>

<template>
  <div class="flex gap-2">
    <PrimeButton
      label="添加文字"
      icon="pi pi-plus"
      size="small"
      severity="info"
      outlined
      @click="emit('addText')"
    />
    <PrimeButton
      label="添加图片"
      icon="pi pi-plus"
      size="small"
      severity="warn"
      outlined
      @click="emit('addImage')"
    />
  </div>
</template>
