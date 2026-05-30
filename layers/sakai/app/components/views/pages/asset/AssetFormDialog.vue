<script lang="ts" setup>
import { AssetService } from '@sakai/services/AssetService';
import type { Asset, MediaBehavior } from '@sakai/types/asset';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Asset | null>('editData', { default: null });
const sceneId = defineModel<string>('sceneId', { required: true });
const existingTags = defineModel<string[]>('existingTags', {
  default: () => [],
});

const emit = defineEmits<{ saved: [] }>();

const service = useService(AssetService);
const submitted = ref(false);
const selectedFile = ref<File | null>(null);
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const form = ref({
  title: '',
  description: '',
  tags: [] as string[],
  behavior: 'inline' as MediaBehavior,
  fileName: '',
  fileSize: 0,
  mimeType: '',
  md5: '',
});

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    selectedFile.value = null;
    if (editData.value) {
      form.value = {
        title: editData.value.title || '',
        description: editData.value.description || '',
        tags: [...editData.value.tags],
        behavior: editData.value.behavior,
        fileName: editData.value.fileName,
        fileSize: editData.value.fileSize,
        mimeType: editData.value.mimeType,
        md5: editData.value.md5,
      };
    } else {
      form.value = {
        title: '',
        description: '',
        tags: [],
        behavior: 'inline',
        fileName: '',
        fileSize: 0,
        mimeType: '',
        md5: '',
      };
    }
  }
});

function onFileSelect(event: { files: File[] }): void {
  const file = event.files[0];
  if (!file) return;

  if (file.size > MAX_FILE_SIZE) {
    submitted.value = true;
    return;
  }

  selectedFile.value = file;
  form.value.fileName = file.name;
  form.value.fileSize = file.size;
  form.value.mimeType = file.type || 'application/octet-stream';

  const inlineTypes = [
    'image/',
    'video/',
    'audio/',
    'text/',
    'application/pdf',
  ];
  form.value.behavior = inlineTypes.some((t) => file.type.startsWith(t))
    ? 'inline'
    : 'attachment';
}

function onFileRemove(): void {
  selectedFile.value = null;
  form.value.fileName = '';
  form.value.fileSize = 0;
  form.value.mimeType = '';
}

async function handleSave(): Promise<void> {
  submitted.value = true;

  if (!isEdit.value && !selectedFile.value) return;

  if (isEdit.value && editData.value) {
    await service.update(sceneId.value, editData.value.id, {
      file: selectedFile.value || undefined,
      title: form.value.title.trim() || undefined,
      description: form.value.description.trim() || undefined,
      tags: form.value.tags,
      behavior: form.value.behavior,
    });
  } else {
    await service.create(sceneId.value, selectedFile.value!, {
      title: form.value.title.trim() || undefined,
      description: form.value.description.trim() || undefined,
      tags: form.value.tags,
      behavior: form.value.behavior,
    });
  }
  emit('saved');
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑素材' : '上传素材'"
    :modal="true"
    :style="{ width: '580px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div v-if="!isEdit" class="flex flex-col gap-2">
        <label class="text-sm font-medium"
          >选择文件 <span class="text-red-500">*</span></label
        >
        <PrimeFileUpload
          :custom-upload="true"
          :auto="false"
          :multiple="false"
          :max-file-size="MAX_FILE_SIZE"
          name="file"
          @select="onFileSelect"
          @remove="onFileRemove"
          @clear="onFileRemove"
        >
          <template #empty>
            <div class="flex flex-col items-center gap-3 py-4">
              <i class="pi pi-cloud-upload text-surface-400! text-4xl!" />
              <span class="text-surface-500 text-sm"
                >拖拽文件到此处，或点击选择</span
              >
              <span class="text-surface-400 text-xs"
                >支持任意格式，单文件最大 50 MB</span
              >
            </div>
          </template>
        </PrimeFileUpload>
        <small v-if="submitted && !selectedFile" class="text-red-500"
          >请选择文件</small
        >
      </div>

      <div v-if="selectedFile || isEdit" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">文件名</label>
          <PrimeInputText :value="form.fileName" disabled class="w-full" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">标题</label>
          <PrimeInputText
            v-model="form.title"
            placeholder="可选，用于搜索和展示"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">描述</label>
          <PrimeTextarea
            v-model="form.description"
            rows="2"
            placeholder="可选"
            class="w-full"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">标签</label>
          <TagInput
            v-model="form.tags"
            :suggestions="existingTags"
            placeholder="输入标签，回车添加"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium"
            >浏览器行为 <span class="text-red-500">*</span></label
          >
          <div class="flex gap-3">
            <div class="flex items-center gap-2">
              <PrimeRadioButton
                v-model="form.behavior"
                value="inline"
                input-id="rb-inline"
              />
              <label for="rb-inline" class="text-sm">在线预览</label>
            </div>
            <div class="flex items-center gap-2">
              <PrimeRadioButton
                v-model="form.behavior"
                value="attachment"
                input-id="rb-attach"
              />
              <label for="rb-attach" class="text-sm">触发下载</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton :label="isEdit ? '更新' : '上传'" @click="handleSave" />
    </template>
  </PrimeDialog>
</template>
