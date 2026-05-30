<script lang="ts" setup>
import type { CertificateEditorService } from '@sakai/services/CertificateEditorService';

const props = defineProps<{
  editor: CertificateEditorService;
}>();

function onBgFileSelect(event: { files: File[] }) {
  const file = event.files[0];
  if (!file || !props.editor.template) return;

  const blobUrl = URL.createObjectURL(file);
  props.editor.template.backgroundUrl = blobUrl;
  props.editor.isDirty = true;

  const img = new Image();
  img.onload = () => {
    props.editor.template!.width = img.naturalWidth;
    props.editor.template!.height = img.naturalHeight;
    props.editor.triggerRerender();
  };
  img.src = blobUrl;
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <h5 class="text-muted-color text-sm font-semibold uppercase">基本信息</h5>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-sm">模板名称</label>
        <PrimeInputText
          :model-value="editor.template?.name"
          class="w-full"
          @update:model-value="
            (v: string | undefined) => {
              if (editor.template) {
                editor.template.name = v ?? '';
                editor.isDirty = true;
              }
            }
          "
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm">分类</label>
        <PrimeSelect
          :model-value="editor.template?.category"
          :options="[
            { label: '证书', value: 'certificate' },
            { label: '海报', value: 'poster' },
          ]"
          option-label="label"
          option-value="value"
          class="w-full"
          @update:model-value="
            (v: string | undefined) => {
              if (editor.template && v) {
                editor.template.category = v;
                editor.isDirty = true;
              }
            }
          "
        />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm">描述</label>
      <PrimeTextarea
        :model-value="editor.template?.description"
        rows="2"
        class="w-full"
        @update:model-value="
          (v: string | undefined) => {
            if (editor.template) {
              editor.template.description = v ?? '';
              editor.isDirty = true;
            }
          }
        "
      />
    </div>

    <div class="flex flex-col gap-1">
      <label class="text-sm">底图</label>
      <div class="w-full">
        <PrimeFileUpload
          mode="basic"
          accept="image/*"
          custom-upload
          @select="onBgFileSelect"
        />
      </div>
      <span
        v-if="editor.template?.backgroundUrl"
        class="text-xs text-green-600"
      >
        已加载底图
      </span>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="flex flex-col gap-1">
        <label class="text-sm">宽度（px）</label>
        <PrimeInputNumber
          :model-value="editor.template?.width"
          class="w-full"
          @update:model-value="
            (v: number) => {
              if (editor.template) {
                editor.template.width = v;
                editor.isDirty = true;
                editor.triggerRerender();
              }
            }
          "
        />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm">高度（px）</label>
        <PrimeInputNumber
          :model-value="editor.template?.height"
          class="w-full"
          @update:model-value="
            (v: number) => {
              if (editor.template) {
                editor.template.height = v;
                editor.isDirty = true;
                editor.triggerRerender();
              }
            }
          "
        />
      </div>
    </div>
  </div>
</template>
