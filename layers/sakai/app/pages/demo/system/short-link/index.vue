<script lang="ts" setup>
import ShortLinkBatchEditDialog from '@sakai/components/views/pages/short-link/ShortLinkBatchEditDialog.vue';
import ShortLinkBulkImportDialog from '@sakai/components/views/pages/short-link/ShortLinkBulkImportDialog.vue';
import ShortLinkDeleteDialog from '@sakai/components/views/pages/short-link/ShortLinkDeleteDialog.vue';
import ShortLinkFormDialog from '@sakai/components/views/pages/short-link/ShortLinkFormDialog.vue';
import ShortLinkQRDialog from '@sakai/components/views/pages/short-link/ShortLinkQRDialog.vue';
import { ShortLinkMgrService } from '@sakai/services/ShortLinkMgrService';
import { ShortLinkService } from '@sakai/services/ShortLinkService';

declareProviders([ShortLinkService, ShortLinkMgrService]);

const mgr = useService(ShortLinkMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '短链工具' });

function onSaved(): void {
  const result = mgr.onFormSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '短链已更新' : '短链已创建',
    life: 3000,
  });
}

async function onDeleteConfirm(): Promise<void> {
  try {
    await mgr.onDeleteConfirm();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '短链已删除',
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

async function onBulkImported(
  rows: Parameters<typeof mgr.onBulkImported>[0],
): Promise<void> {
  const c = await mgr.onBulkImported(rows);
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: `成功导入 ${c} 条短链`,
    life: 3000,
  });
}

async function onBatchEdited(
  data: Parameters<typeof mgr.onBatchEdited>[0],
): Promise<void> {
  await mgr.onBatchEdited(data);
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '成功修改短链',
    life: 3000,
  });
}

function confirmBatchDelete(): void {
  mgr.deleteDialogVisible = true;
}

function exportCSV(): void {
  dt.value.exportCSV();
}

async function copyLink(code: string): Promise<void> {
  const { default: copy } = await import('copy-to-clipboard');
  copy(mgr.getFullShortUrl(code));
  toast.add({
    severity: 'info',
    summary: '已复制',
    detail: '短链接已复制到剪贴板',
    life: 2000,
  });
}

onMounted(() => {
  mgr.loadLinks();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="flex flex-wrap items-end gap-4">
        <div class="min-w-50 flex-1">
          <label
            class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
            >关键词</label
          >
          <PrimeInputText
            v-model="mgr.searchQuery.keyword"
            placeholder="搜索标题、短码、目标URL"
            fluid
            @keyup.enter="mgr.onSearch(mgr.searchQuery)"
          />
        </div>
        <div class="w-50">
          <label
            class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
            >活动标签</label
          >
          <PrimeSelect
            v-model="mgr.searchQuery.campaign"
            :options="mgr.allCampaigns.map((c) => ({ label: c, value: c }))"
            option-label="label"
            option-value="value"
            placeholder="全部标签"
            show-clear
            fluid
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

    <!-- 工具栏 + 数据表格 -->
    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="新建短链"
              icon="pi pi-plus"
              severity="primary"
              @click="mgr.openNew()"
            />
            <PrimeButton
              label="批量导入"
              icon="pi pi-upload"
              severity="secondary"
              @click="mgr.openBulkImport()"
            />
            <PrimeButton
              label="批量编辑"
              icon="pi pi-pencil"
              severity="secondary"
              :disabled="mgr.selectedLinks.length === 0"
              @click="mgr.openBatchEdit()"
            />
            <PrimeButton
              label="批量删除"
              icon="pi pi-trash"
              severity="danger"
              :disabled="mgr.selectedLinks.length === 0"
              @click="confirmBatchDelete"
            />
          </div>
        </template>
        <template #end>
          <PrimeButton
            label="导出 CSV"
            icon="pi pi-download"
            severity="secondary"
            @click="exportCSV"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        v-model:selection="mgr.selectedLinks"
        :value="mgr.links"
        :loading="mgr.loading"
        data-key="id"
        :paginator="true"
        :rows="10"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="{first} - {last} / 共 {totalRecords} 条"
        striped-rows
        size="small"
        class="text-sm"
      >
        <PrimeColumn selection-mode="multiple" header-style="width:3rem" />
        <PrimeColumn field="title" header="标题" sortable>
          <template #body="{ data }">
            <div class="max-w-50 truncate">
              {{ data.title || '--' }}
            </div>
          </template>
        </PrimeColumn>
        <PrimeColumn field="shortCode" header="短码" sortable>
          <template #body="{ data }">
            <span class="text-primary font-mono text-xs">
              {{ data.shortCode }}
            </span>
          </template>
        </PrimeColumn>
        <PrimeColumn field="originalUrl" header="目标 URL">
          <template #body="{ data }">
            <div class="max-w-62.5 truncate text-xs">
              {{ data.originalUrl }}
            </div>
          </template>
        </PrimeColumn>
        <PrimeColumn field="campaign" header="活动标签" sortable>
          <template #body="{ data }">
            <PrimeTag
              v-if="data.campaign"
              :value="data.campaign"
              severity="info"
            />
            <span v-else class="text-surface-400">--</span>
          </template>
        </PrimeColumn>
        <PrimeColumn header="状态" sortable field="expireAt">
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.getStatusLabel(data)"
              :severity="mgr.getStatusSeverity(data)"
            />
          </template>
        </PrimeColumn>
        <PrimeColumn header="操作" header-style="width:180px">
          <template #body="{ data }">
            <div class="flex gap-1">
              <PrimeButton
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                text
                rounded
                @click="mgr.openEdit(data)"
                v-tooltip.top="'编辑'"
              />
              <PrimeButton
                icon="pi pi-qrcode"
                size="small"
                severity="secondary"
                text
                rounded
                @click="mgr.showQR(data)"
                v-tooltip.top="'二维码'"
              />
              <PrimeButton
                icon="pi pi-copy"
                size="small"
                severity="secondary"
                text
                rounded
                @click="copyLink(data.shortCode)"
                v-tooltip.top="'复制链接'"
              />
              <PrimeButton
                icon="pi pi-trash"
                size="small"
                severity="danger"
                text
                rounded
                @click="mgr.confirmDelete(data)"
                v-tooltip.top="'删除'"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- 弹窗 -->
    <ShortLinkFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />
    <ShortLinkDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      v-model:target="mgr.deleteTarget"
      :count="mgr.selectedLinks.length"
      @confirm="onDeleteConfirm"
    />
    <ShortLinkQRDialog
      v-model:visible="mgr.qrDialogVisible"
      v-model:data="mgr.qrData"
    />
    <ShortLinkBulkImportDialog
      v-model:visible="mgr.bulkImportDialogVisible"
      @imported="onBulkImported"
    />
    <ShortLinkBatchEditDialog
      v-model:visible="mgr.batchEditDialogVisible"
      :count="mgr.selectedLinks.length"
      @confirm="onBatchEdited"
    />
  </div>
</template>
