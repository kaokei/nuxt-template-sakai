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

function onFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  const files = input.files;
  if (!files) return;
  selectedFiles.value = Array.from(files);
}

function removeFile(index: number): void {
  selectedFiles.value.splice(index, 1);
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
      <div
        class="border-surface-300 hover:border-primary relative flex flex-col items-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors"
      >
        <i class="pi pi-cloud-upload text-surface-400 text-3xl" />
        <p class="text-surface-500 text-sm">点击选择多个文件</p>
        <small v-if="selectedFiles.length > 0" class="text-surface-400 text-xs"
          >已选 {{ selectedFiles.length }} 个文件</small
        >
        <input
          type="file"
          multiple
          class="absolute inset-0 cursor-pointer opacity-0"
          @change="onFileSelect"
        />
      </div>

      <div v-if="selectedFiles.length > 0">
        <PrimeDataTable :value="selectedFiles" class="text-sm">
          <PrimeColumn header="#" class="w-12">
            <template #body="{ index }">
              {{ index + 1 }}
            </template>
          </PrimeColumn>
          <PrimeColumn field="name" header="文件名" />
          <PrimeColumn field="size" header="大小" class="w-28">
            <template #body="{ data }">
              {{ (data.size / 1024).toFixed(1) }} KB
            </template>
          </PrimeColumn>
          <PrimeColumn header="" class="w-16">
            <template #body="{ index }">
              <PrimeButton
                icon="pi pi-times"
                severity="secondary"
                text
                size="small"
                @click="removeFile(index)"
              />
            </template>
          </PrimeColumn>
        </PrimeDataTable>
      </div>

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
