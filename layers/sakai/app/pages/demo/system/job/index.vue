<script lang="ts" setup>
import JobFormDialog from '@sakai/components/views/pages/job-mgr/JobFormDialog.vue';
import { JobMgrService } from '@sakai/services/JobMgrService';
import { JobService } from '@sakai/services/JobService';

declareProviders([JobService, JobMgrService]);

const mgr = useService(JobMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '定时任务管理' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '任务已更新' : '任务已创建',
    life: 3000,
  });
}

async function onExecute(id: string) {
  try {
    await mgr.executeJob(id);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '任务已执行',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '执行失败',
      life: 3000,
    });
  }
}

async function onPause(id: string) {
  try {
    await mgr.pauseJob(id);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '任务已暂停',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '暂停失败',
      life: 3000,
    });
  }
}

async function onResume(id: string) {
  try {
    await mgr.resumeJob(id);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '任务已恢复',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '恢复失败',
      life: 3000,
    });
  }
}

async function onDeleteConfirm() {
  try {
    const result = await mgr.onDeleteConfirm();
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

function exportCSV() {
  dt.value.exportCSV();
}

onMounted(() => {
  mgr.loadJobs();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">任务名称</label>
        <PrimeInputText
          v-model="mgr.searchName"
          placeholder="搜索任务名称"
          class="w-36"
          @keydown.enter="mgr.search()"
        />
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">任务组</label>
        <PrimeInputText
          v-model="mgr.searchGroup"
          placeholder="搜索任务组"
          class="w-36"
          @keydown.enter="mgr.search()"
        />
      </div>

      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">状态</label>
        <PrimeSelect
          v-model="mgr.searchStatus"
          :options="[
            { label: '全部', value: '' },
            { label: '运行中', value: 'running' },
            { label: '已暂停', value: 'paused' },
          ]"
          option-label="label"
          option-value="value"
          placeholder="选择状态"
          class="w-28"
        />
      </div>

      <div class="flex gap-2">
        <PrimeButton
          label="搜索"
          icon="pi pi-search"
          severity="primary"
          @click="mgr.search()"
        />
        <PrimeButton
          label="重置"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="mgr.onReset()"
        />
      </div>
    </div>

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新增"
            icon="pi pi-plus"
            severity="primary"
            @click="mgr.openNew()"
          />
        </template>
        <template #end>
          <PrimeButton
            label="导出"
            icon="pi pi-download"
            severity="secondary"
            @click="exportCSV"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        :value="mgr.jobs"
        data-key="id"
        :loading="mgr.loading"
        :paginator="true"
        :rows="10"
        scrollable
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条记录"
      >
        <PrimeColumn header="序号" style="min-width: 60px">
          <template #body="{ index }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              index + 1
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="name"
          header="任务名称"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="group"
          header="任务组"
          style="min-width: 120px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.group || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="cron" header="Cron 表达式" style="min-width: 130px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data.cron }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="className" header="执行类" style="min-width: 180px">
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              data.className
            }}</span>
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
              :value="data.status === 'running' ? '运行中' : '已暂停'"
              :severity="mgr.getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="lastRunTime"
          header="上次执行时间"
          style="min-width: 175px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.lastRunTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="nextRunTime"
          header="下次执行时间"
          style="min-width: 175px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.nextRunTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          header="操作"
          :frozen="true"
          align-frozen="right"
          style="min-width: 200px"
          :exportable="false"
        >
          <template #body="{ data }">
            <div class="flex gap-1">
              <PrimeButton
                label="执行"
                icon="pi pi-play"
                size="small"
                severity="success"
                outlined
                @click="onExecute(data.id)"
              />
              <PrimeButton
                v-if="data.status === 'running'"
                label="暂停"
                icon="pi pi-pause"
                size="small"
                severity="warn"
                outlined
                @click="onPause(data.id)"
              />
              <PrimeButton
                v-if="data.status === 'paused'"
                label="恢复"
                icon="pi pi-play"
                size="small"
                severity="info"
                outlined
                @click="onResume(data.id)"
              />
              <PrimeButton
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                rounded
                @click="mgr.openEdit(data)"
              />
              <PrimeButton
                icon="pi pi-trash"
                size="small"
                severity="danger"
                outlined
                rounded
                @click="mgr.confirmDelete(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <JobFormDialog
      v-model:visible="mgr.dialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <PrimeDialog
      v-model:visible="mgr.deleteDialogVisible"
      header="删除确认"
      :modal="true"
      :style="{ width: '480px' }"
      :draggable="false"
    >
      <div class="flex items-start gap-4">
        <i class="pi pi-exclamation-triangle text-3xl text-amber-500" />
        <span class="flex-1 text-sm"
          >确定要删除任务「{{
            mgr.deleteTarget?.name || ''
          }}」吗？此操作不可撤销。</span
        >
      </div>

      <template #footer>
        <PrimeButton
          label="取消"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="mgr.deleteDialogVisible = false"
        />
        <PrimeButton
          label="确认删除"
          icon="pi pi-trash"
          severity="danger"
          @click="onDeleteConfirm"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
