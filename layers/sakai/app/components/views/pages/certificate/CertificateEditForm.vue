<script lang="ts" setup>
import type { CertificateEditorService } from '@sakai/services/CertificateEditorService';
import AddElementToolbar from './AddElementToolbar.vue';
import BasicInfoSection from './BasicInfoSection.vue';
import ImageElementItem from './ImageElementItem.vue';
import TextElementItem from './TextElementItem.vue';

defineProps<{
  editor: CertificateEditorService;
}>();

const emit = defineEmits<{
  save: [];
}>();
</script>

<template>
  <div class="card flex flex-col gap-4 p-4!">
    <h3 class="text-lg font-semibold">模板配置</h3>

    <BasicInfoSection :editor="editor" />

    <PrimeDivider />

    <div class="flex items-center justify-between">
      <h4 class="text-base font-medium">元素列表</h4>
      <AddElementToolbar
        @add-text="editor.addTextElement()"
        @add-image="editor.addImageElement()"
      />
    </div>

    <div
      v-if="editor.elements.length === 0"
      class="text-muted-color py-8 text-center"
    >
      暂无元素，点击上方按钮添加文字或图片元素
    </div>

    <div v-for="el in editor.elements" :key="el.id" class="flex flex-col gap-2">
      <TextElementItem
        v-if="el.type === 'text'"
        :element="el"
        :is-selected="editor.selectedElementId === el.id"
        @select="editor.selectElement($event)"
        @update="(id, patch) => editor.updateElement(id, patch)"
        @remove="editor.removeElement($event)"
      />
      <ImageElementItem
        v-if="el.type === 'image'"
        :element="el"
        :is-selected="editor.selectedElementId === el.id"
        @select="editor.selectElement($event)"
        @update="(id, patch) => editor.updateElement(id, patch)"
        @remove="editor.removeElement($event)"
      />
    </div>

    <PrimeDivider />

    <div class="flex justify-end gap-2">
      <PrimeButton
        label="保存模板"
        icon="pi pi-check"
        severity="primary"
        @click="emit('save')"
      />
    </div>
  </div>
</template>
