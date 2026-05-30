<script lang="ts" setup>
import SceneFormDialog from '@sakai/components/views/pages/asset/SceneFormDialog.vue';
import SceneDeleteDialog from '@sakai/components/views/pages/asset/SceneDeleteDialog.vue';
import { SceneMgrService } from '@sakai/services/SceneMgrService';
import { SceneService } from '@sakai/services/SceneService';

declareProviders([SceneService, SceneMgrService]);

const mgr = useService(SceneMgrService);
const toast = useToast();
const router = useRouter();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '素材管理' });

function onSaved(): void {
  const result = mgr.onFormSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '场景已更新' : '场景已创建',
    life: 3000,
  });
}

async function onDeleteConfirm(): Promise<void> {
  try {
    await mgr.onDeleteConfirm();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '场景已删除',
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

function goToAssets(sceneId: string): void {
  router.push(`/demo/system/asset/${sceneId}`);
}

onMounted(() => {
  mgr.init();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新建场景"
            icon="pi pi-plus"
            severity="primary"
            @click="mgr.openNew()"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        :value="mgr.scenes"
        :loading="mgr.loading"
        striped-rows
        class="text-sm"
      >
        <PrimeColumn field="name" header="场景名称" class="min-w-[150px]">
          <template #body="{ data }">
            <a
              class="text-primary cursor-pointer hover:underline"
              @click="goToAssets(data.id)"
            >
              {{ data.name }}
            </a>
          </template>
        </PrimeColumn>
        <PrimeColumn field="description" header="描述" class="min-w-[200px]" />
        <PrimeColumn field="assetCount" header="素材数量" class="w-28">
          <template #body="{ data }">
            <PrimeTag :value="String(data.assetCount)" severity="info" />
          </template>
        </PrimeColumn>
        <PrimeColumn field="createdAt" header="创建时间" class="w-44">
          <template #body="{ data }">
            {{ new Date(data.createdAt).toLocaleDateString('zh-CN') }}
          </template>
        </PrimeColumn>
        <PrimeColumn header="操作" class="w-36">
          <template #body="{ data }">
            <div class="flex gap-2">
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

    <SceneFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />
    <SceneDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      v-model:target="mgr.deleteTarget"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
