<script lang="ts" setup>
import { AssetService } from '@sakai/services/AssetService';
import type { MediaBehavior } from '@sakai/types/asset';

const visible = defineModel<boolean>('visible', { required: true });
const sceneId = defineModel<string>('sceneId', { required: true });
const existingTags = defineModel<string[]>('existingTags', {
  default: () => [],
});
const emit = defineEmits<{ uploaded: [count: number] }>();

const service = useService(AssetService);
const selectedFiles = ref<File[]>([]);
const commonTags = ref<string[]>([]);
const commonBehavior = ref<MediaBehavior>('inline');
const uploading = ref(false);

watch(visible, (isVisible) => {
  if (isVisible) {
    selectedFiles.value = [];
    commonTags.value = [];
    commonBehavior.value = 'inline';
    uploading.value = false;
  }
});

function onFileSelect(event: { files: File[] }): void {
  selectedFiles.value = [...selectedFiles.value, ...event.files];
}

function onFileClear(): void {
  selectedFiles.value = [];
}

function onFileRemove(event: { file: File }): void {
  selectedFiles.value = selectedFiles.value.filter(
    (f) =>
      !(
        f.name === event.file.name &&
        f.size === event.file.size &&
        f.lastModified === event.file.lastModified
      ),
  );
}

async function handleUpload(): Promise<void> {
  if (selectedFiles.value.length === 0) return;
  uploading.value = true;
  try {
    await service.batchCreate(sceneId.value, selectedFiles.value, {
      tags: commonTags.value,
      behavior: commonBehavior.value,
    });
    emit('uploaded', selectedFiles.value.length);
  } catch {
    // 错误由上层 Toast 处理
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="批量上传素材"
    :modal="true"
    :style="{ width: '620px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">选择文件</label>
        <PrimeFileUpload
          :custom-upload="true"
          :auto="false"
          :multiple="true"
          name="files"
          @select="onFileSelect"
          @remove="onFileRemove"
          @clear="onFileClear"
        >
          <template #header="{ files, clearCallback }">
            <div
              v-if="files.length > 0"
              class="border-surface-200 bg-surface-50 flex items-center justify-between rounded-t-lg border-b px-3 py-2"
            >
              <span class="text-surface-500 text-xs"
                >{{ files.length }} 个文件</span
              >
              <PrimeButton
                icon="pi pi-times"
                severity="secondary"
                text
                size="small"
                @click="clearCallback()"
              />
            </div>
          </template>
          <template #empty>
            <div class="flex flex-col items-center gap-3 py-4">
              <i class="pi pi-cloud-upload !text-surface-400 !text-4xl" />
              <span class="text-surface-500 text-sm"
                >拖拽文件到此处，或点击选择</span
              >
            </div>
          </template>
        </PrimeFileUpload>
        <small v-if="selectedFiles.length > 0" class="text-surface-400 text-xs"
          >已选 {{ selectedFiles.length }} 个文件</small
        >
      </div>

      <div v-if="selectedFiles.length > 0" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">统一标签</label>
          <TagInput
            v-model="commonTags"
            :suggestions="existingTags"
            placeholder="所有文件应用相同标签"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">统一浏览器行为</label>
          <div class="flex gap-3">
            <div class="flex items-center gap-2">
              <PrimeRadioButton
                v-model="commonBehavior"
                value="inline"
                input-id="batch-inline"
              />
              <label for="batch-inline" class="text-sm">在线预览</label>
            </div>
            <div class="flex items-center gap-2">
              <PrimeRadioButton
                v-model="commonBehavior"
                value="attachment"
                input-id="batch-attach"
              />
              <label for="batch-attach" class="text-sm">触发下载</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton
        label="全部上传"
        :disabled="selectedFiles.length === 0"
        :loading="uploading"
        @click="handleUpload"
      />
    </template>
  </PrimeDialog>
</template>
