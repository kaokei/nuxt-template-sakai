<script lang="ts" setup>
import SysParamDeleteDialog from '@sakai/components/views/pages/sys-param-mgr/SysParamDeleteDialog.vue';
import SysParamFormDialog from '@sakai/components/views/pages/sys-param-mgr/SysParamFormDialog.vue';
import SysParamSearchBar from '@sakai/components/views/pages/sys-param-mgr/SysParamSearchBar.vue';
import { SysParamMgrService } from '@sakai/services/SysParamMgrService';
import { SysParamService } from '@sakai/services/SysParamService';

declareProviders([SysParamService, SysParamMgrService]);

const mgr = useService(SysParamMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '参数配置' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '参数已更新' : '参数已创建',
    life: 3000,
  });
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
  mgr.loadParams();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <SysParamSearchBar @search="mgr.search" @reset="mgr.onReset" />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              v-permission="'system:param:add'"
              label="新增"
              icon="pi pi-plus"
              severity="primary"
              @click="mgr.openNew"
            />
            <PrimeButton
              label="批量删除"
              icon="pi pi-trash"
              severity="danger"
              outlined
              :disabled="!mgr.selectedParams || mgr.selectedParams.length === 0"
              @click="mgr.confirmBatchDelete"
            />
          </div>
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
        v-model:selection="mgr.selectedParams"
        :value="mgr.params"
        data-key="id"
        :loading="mgr.loading"
        :paginator="true"
        :rows="mgr.pageSize"
        :total-records="mgr.totalRecords"
        :lazy="true"
        :sort-field="mgr.sortField"
        :sort-order="mgr.sortOrder"
        scrollable
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条记录，当前第 {first} 到 {last} 条"
        @page="mgr.onPage"
        @sort="mgr.onSort"
      >
        <PrimeColumn
          selection-mode="multiple"
          :frozen="true"
          style="width: 3rem"
          :exportable="false"
        />

        <PrimeColumn header="序号" style="min-width: 80px">
          <template #body="{ index }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              (mgr.page - 1) * mgr.pageSize + index + 1
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="name"
          header="参数名称"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="key"
          header="参数键"
          style="min-width: 150px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data.key }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="value" header="参数值" style="min-width: 150px">
          <template #body="{ data }">
            <span>{{ data.value }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="type" header="类型" style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.typeLabels[data.type] || data.type"
              severity="info"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="group"
          header="分组"
          style="min-width: 120px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.group || '--' }}</span>
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
          field="sort"
          header="排序"
          style="min-width: 80px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.sort }}</span>
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
          style="min-width: 120px"
          :exportable="false"
        >
          <template #body="{ data }">
            <div class="flex gap-1">
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

    <SysParamFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <SysParamDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      :mode="mgr.deleteMode"
      :param="mgr.deleteTarget"
      :batch-count="mgr.selectedParams?.length || 0"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
