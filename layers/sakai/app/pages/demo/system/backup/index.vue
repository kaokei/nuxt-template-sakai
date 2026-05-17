<script lang="ts" setup>
import { BackupMgrService } from '@sakai/services/BackupMgrService';
import { BackupService } from '@sakai/services/BackupService';

declareProviders([BackupService, BackupMgrService]);

const mgr = useService(BackupMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '数据备份管理' });

// ==================== 新建备份表单 ====================
const formSubmitted = ref(false);
const form = ref({
  name: '',
  type: 'full' as 'full' | 'incremental',
  remark: '',
});

const typeOptions = [
  { label: '全量备份', value: 'full' },
  { label: '增量备份', value: 'incremental' },
];

watch(
  () => mgr.formDialogVisible,
  (isVisible) => {
    if (isVisible) {
      formSubmitted.value = false;
      form.value = {
        name: mgr.editData?.name || '',
        type: mgr.editData?.type || 'full',
        remark: mgr.editData?.remark || '',
      };
    }
  },
);

async function handleCreate() {
  formSubmitted.value = true;
  if (!form.value.name.trim()) return;

  try {
    await mgr.createBackup(form.value);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '备份已创建',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '创建备份失败',
      life: 3000,
    });
  }
}

// ==================== 删除备份 ====================
async function handleDeleteConfirm() {
  try {
    const result = await mgr.confirmDelete();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: result.message,
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

// ==================== 搜索 ====================
const statusOptions = [
  { label: '成功', value: 'success' },
  { label: '失败', value: 'failed' },
  { label: '进行中', value: 'running' },
];

const searchTypeOptions = [
  { label: '全量备份', value: 'full' },
  { label: '增量备份', value: 'incremental' },
];

function handleSearch() {
  mgr.onSearch();
}

function handleReset() {
  mgr.onReset();
}

onMounted(() => {
  mgr.loadBackups();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 搜索栏 -->
    <div
      class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">备份名称</label>
        <PrimeInputText
          v-model="mgr.searchName"
          placeholder="搜索备份名称"
          class="w-36"
          @keydown.enter="handleSearch"
        />
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">状态</label>
        <PrimeSelect
          v-model="mgr.searchStatus"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="全部"
          show-clear
        />
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">类型</label>
        <PrimeSelect
          v-model="mgr.searchType"
          :options="searchTypeOptions"
          option-label="label"
          option-value="value"
          placeholder="全部"
          show-clear
        />
      </div>

      <div class="flex items-center gap-2">
        <PrimeButton
          label="搜索"
          icon="pi pi-search"
          severity="primary"
          @click="handleSearch"
        />
        <PrimeButton
          label="重置"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="handleReset"
        />
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新建备份"
            icon="pi pi-plus"
            severity="primary"
            @click="mgr.openCreate"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        :value="mgr.backups"
        data-key="id"
        :loading="mgr.loading"
        :paginator="true"
        :rows="10"
        scrollable
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条记录，当前第 {first} 到 {last} 条"
      >
        <PrimeColumn header="序号" style="min-width: 80px">
          <template #body="{ index }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              index + 1
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="name"
          header="备份名称"
          :frozen="true"
          style="min-width: 160px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="fileName" header="文件名" style="min-width: 200px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data.fileName || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="fileSize"
          header="文件大小"
          style="min-width: 100px"
        >
          <template #body="{ data }">
            <span class="text-sm">{{ mgr.formatFileSize(data.fileSize) }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="type" header="类型" style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.typeLabels[data.type] || data.type"
              :severity="data.type === 'full' ? 'info' : 'secondary'"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="status"
          header="状态"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.statusLabels[data.status] || data.status"
              :severity="mgr.getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="createTime"
          header="创建时间"
          style="min-width: 175px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.createTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          header="操作"
          :frozen="true"
          align-frozen="right"
          style="min-width: 80px"
          :exportable="false"
        >
          <template #body="{ data }">
            <PrimeButton
              icon="pi pi-trash"
              size="small"
              severity="danger"
              outlined
              rounded
              @click="mgr.openDelete(data)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- 新建备份弹窗 -->
    <PrimeDialog
      v-model:visible="mgr.formDialogVisible"
      header="新建备份"
      :modal="true"
      :style="{ width: '480px' }"
      :draggable="false"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="backupName" class="text-sm font-medium">备份名称</label>
          <PrimeInputText
            id="backupName"
            v-model="form.name"
            placeholder="请输入备份名称"
            :invalid="formSubmitted && !form.name.trim()"
          />
          <small v-if="formSubmitted && !form.name.trim()" class="text-red-500">
            备份名称不能为空
          </small>
        </div>

        <div class="flex flex-col gap-1">
          <label for="backupType" class="text-sm font-medium">备份类型</label>
          <PrimeSelect
            id="backupType"
            v-model="form.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            placeholder="选择类型"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="backupRemark" class="text-sm font-medium">备注</label>
          <PrimeTextarea
            id="backupRemark"
            v-model="form.remark"
            rows="3"
            placeholder="请输入备注信息（可选）"
          />
        </div>
      </div>

      <template #footer>
        <PrimeButton
          label="取消"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="mgr.formDialogVisible = false"
        />
        <PrimeButton
          label="创建"
          icon="pi pi-check"
          severity="primary"
          @click="handleCreate"
        />
      </template>
    </PrimeDialog>

    <!-- 删除确认弹窗 -->
    <PrimeDialog
      v-model:visible="mgr.deleteDialogVisible"
      header="删除确认"
      :modal="true"
      :style="{ width: '480px' }"
      :draggable="false"
    >
      <div class="flex items-start gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-amber-500" />
        <span class="flex-1 text-sm">
          确定要删除备份「{{
            mgr.deleteTarget?.name || ''
          }}」吗？此操作不可撤销。
        </span>
      </div>

      <template #footer>
        <PrimeButton
          label="取消"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="mgr.cancelDelete()"
        />
        <PrimeButton
          label="确认删除"
          icon="pi pi-trash"
          severity="danger"
          @click="handleDeleteConfirm"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
