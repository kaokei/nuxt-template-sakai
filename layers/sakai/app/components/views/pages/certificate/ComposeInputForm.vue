<script lang="ts" setup>
import type { TemplateElement } from '@sakai/types/certificate';

defineProps<{
  elements: TemplateElement[];
  values: Record<string, string>;
  fileMap: Record<string, string>;
}>();

const emit = defineEmits<{
  inputChange: [elementId: string, value: string];
  fileChange: [elementId: string, file: File | null];
}>();

function onFileSelect(elementId: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0] ?? null;
  emit('fileChange', elementId, file);
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div v-for="el in elements" :key="el.id" class="flex flex-col gap-1">
      <template v-if="el.type === 'text'">
        <label class="text-sm font-medium">{{ el.name }}</label>
        <PrimeInputText
          :model-value="values[el.id] || ''"
          class="w-full"
          :placeholder="`请输入${el.name}`"
          @update:model-value="
            (v: string | undefined) => emit('inputChange', el.id, v ?? '')
          "
        />
      </template>
      <template v-if="el.type === 'image'">
        <label class="text-sm font-medium">{{ el.name }}</label>
        <input
          type="file"
          accept="image/*"
          class="text-sm"
          @change="(e) => onFileSelect(el.id, e)"
        />
        <span v-if="fileMap[el.id]" class="text-xs text-green-600"
          >已选择图片</span
        >
      </template>
    </div>
  </div>
</template>
