<script lang="ts" setup>
import AssetFormDialog from '@sakai/components/views/pages/asset/AssetFormDialog.vue';
import AssetBatchUploadDialog from '@sakai/components/views/pages/asset/AssetBatchUploadDialog.vue';
import AssetPreviewDialog from '@sakai/components/views/pages/asset/AssetPreviewDialog.vue';
import AssetDeleteDialog from '@sakai/components/views/pages/asset/AssetDeleteDialog.vue';
import { AssetMgrService } from '@sakai/services/AssetMgrService';
import { AssetService } from '@sakai/services/AssetService';
import { SceneService } from '@sakai/services/SceneService';
import { SceneMgrService } from '@sakai/services/SceneMgrService';
import type { MimeCategory } from '@sakai/types/asset';

declareProviders([
  AssetService,
  AssetMgrService,
  SceneService,
  SceneMgrService,
]);

definePageMeta({ layout: 'sakai-sidebar' });

const mgr = useService(AssetMgrService);
const sceneMgr = useService(SceneMgrService);
const toast = useToast();
const route = useRoute();
const router = useRouter();
const dt = ref();

const sceneId = computed(() => route.params.sceneId as string);

const mimeTabs: { label: string; value: MimeCategory | undefined }[] = [
  { label: '全部', value: undefined },
  { label: '图片', value: 'image' },
  { label: '文档', value: 'document' },
  { label: '压缩包', value: 'archive' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
  { label: '其他', value: 'other' },
];

async function onSceneChange(sceneId: string): Promise<void> {
  await router.push(`/demo/system/asset/${sceneId}`);
}

function onSaved(): void {
  const result = mgr.onFormSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '素材已更新' : '素材已上传',
    life: 3000,
  });
}

async function onDeleteConfirm(): Promise<void> {
  try {
    await mgr.onDeleteConfirm();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '素材已删除',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '删除失败',
      life: 3000,
    });
  }
}

async function onBatchUploaded(count: number): Promise<void> {
  await mgr.onBatchUploaded(count);
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `成功上传 ${count} 个素材`,
    life: 3000,
  });
}

async function copyLink(url: string): Promise<void> {
  const { default: copy } = await import('copy-to-clipboard');
  copy(url);
  toast.add({
    severity: 'info',
    summary: '已复制',
    detail: '链接已复制到剪贴板',
    life: 2000,
  });
}

function confirmBatchDelete(): void {
  mgr.deleteTarget = null;
  mgr.deleteDialogVisible = true;
}

function exportCSV(): void {
  dt.value.exportCSV();
}

watch(
  sceneId,
  (newId) => {
    if (newId) {
      sceneMgr.loadScenes();
      mgr.loadAssets(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="card p-4!">
      <div class="mb-4 flex flex-wrap items-center gap-4">
        <div class="min-w-[200px]">
          <label class="text-surface-500 mb-1 block text-xs">当前场景</label>
          <PrimeSelect
            :model-value="sceneId"
            :options="sceneMgr.scenes"
            option-label="name"
            option-value="id"
            placeholder="选择场景"
            class="w-full"
            @update:model-value="onSceneChange"
          />
        </div>
      </div>
    </div>

    <div
      class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex flex-wrap items-end gap-4">
        <div class="min-w-[200px] flex-1">
          <label class="text-surface-500 mb-1 block text-xs">关键词</label>
          <PrimeInputText
            v-model="mgr.searchQuery.keyword"
            placeholder="搜索文件名、标题"
            fluid
            @keyup.enter="mgr.onSearch(mgr.searchQuery)"
          />
        </div>
        <div class="min-w-[180px]">
          <label class="text-surface-500 mb-1 block text-xs">标签筛选</label>
          <PrimeSelect
            v-model="mgr.searchQuery.tags"
            :options="mgr.allTags.map((t) => ({ label: t, value: t }))"
            option-label="label"
            option-value="value"
            placeholder="全部标签"
            show-clear
            fluid
          />
        </div>
        <div>
          <label class="text-surface-500 mb-1 block text-xs">类型</label>
          <PrimeSelectButton
            v-model="mgr.activeMimeCategory"
            :options="mimeTabs"
            option-label="label"
            option-value="value"
            @update:model-value="mgr.onMimeTabChange($event)"
          />
        </div>
        <div class="flex gap-2">
          <PrimeButton
            icon="pi pi-search"
            label="搜索"
            severity="primary"
            @click="mgr.onSearch(mgr.searchQuery)"
          />
          <PrimeButton
            icon="pi pi-refresh"
            label="重置"
            severity="secondary"
            @click="mgr.onReset()"
          />
        </div>
      </div>
    </div>

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="上传素材"
              icon="pi pi-plus"
              severity="primary"
              @click="mgr.openUpload()"
            />
            <PrimeButton
              label="批量上传"
              icon="pi pi-upload"
              severity="secondary"
              @click="mgr.openBatchUpload()"
            />
            <PrimeButton
              label="批量删除"
              icon="pi pi-trash"
              severity="danger"
              :disabled="mgr.selectedAssets.length === 0"
              @click="confirmBatchDelete()"
            />
          </div>
        </template>
        <template #end>
          <PrimeButton
            label="导出CSV"
            icon="pi pi-download"
            severity="secondary"
            @click="exportCSV"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        v-model:selection="mgr.selectedAssets"
        :value="mgr.assets"
        :loading="mgr.loading"
        data-key="id"
        striped-rows
        class="text-sm"
      >
        <PrimeColumn selection-mode="multiple" class="w-12" />
        <PrimeColumn field="fileName" header="文件名" class="min-w-[180px]" />
        <PrimeColumn field="title" header="标题" class="min-w-[120px]">
          <template #body="{ data }">
            {{ data.title || '-' }}
          </template>
        </PrimeColumn>
        <PrimeColumn field="fileSize" header="大小" class="w-24">
          <template #body="{ data }">
            {{
              data.fileSize > 1024 * 1024
                ? (data.fileSize / 1024 / 1024).toFixed(1) + ' MB'
                : (data.fileSize / 1024).toFixed(0) + ' KB'
            }}
          </template>
        </PrimeColumn>
        <PrimeColumn field="mimeType" header="类型" class="w-20">
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.getMimeCategory(data.mimeType)"
              severity="info"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn header="行为" class="w-20">
          <template #body="{ data }">
            <i
              v-if="data.behavior === 'inline'"
              class="pi pi-eye text-primary"
            />
            <i v-else class="pi pi-download text-orange-500" />
          </template>
        </PrimeColumn>
        <PrimeColumn field="tags" header="标签" class="min-w-[150px]">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <PrimeTag
                v-for="tag in data.tags"
                :key="tag"
                :value="tag"
                severity="info"
                class="text-xs"
              />
            </div>
          </template>
        </PrimeColumn>
        <PrimeColumn header="操作" class="min-w-[220px]">
          <template #body="{ data }">
            <div class="flex gap-1">
              <PrimeButton
                icon="pi pi-copy"
                severity="info"
                text
                size="small"
                @click="copyLink(data.url)"
              />
              <PrimeButton
                icon="pi pi-eye"
                severity="secondary"
                text
                size="small"
                @click="mgr.openPreview(data)"
              />
              <PrimeButton
                icon="pi pi-pencil"
                severity="secondary"
                text
                size="small"
                @click="mgr.openEdit(data)"
              />
              <PrimeButton
                icon="pi pi-trash"
                severity="danger"
                text
                size="small"
                @click="mgr.confirmDelete(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <AssetFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      v-model:scene-id="sceneId"
      v-model:existing-tags="mgr.allTags"
      @saved="onSaved"
    />
    <AssetBatchUploadDialog
      v-model:visible="mgr.batchUploadDialogVisible"
      v-model:scene-id="sceneId"
      v-model:existing-tags="mgr.allTags"
      @uploaded="onBatchUploaded"
    />
    <AssetPreviewDialog
      v-model:visible="mgr.previewDialogVisible"
      v-model:asset="mgr.previewData"
    />
    <AssetDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      v-model:target="mgr.deleteTarget"
      v-model:count="mgr.selectedAssets.length"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
