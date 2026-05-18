<script lang="ts" setup>
import OperLogDetailDialog from '@sakai/components/views/pages/oper-log/OperLogDetailDialog.vue';
import OperLogSearchBar from '@sakai/components/views/pages/oper-log/OperLogSearchBar.vue';
import { OperLogMgrService } from '@sakai/services/OperLogMgrService';

const mgr = useService(OperLogMgrService);
const dt = ref();

function exportCSV() {
  dt.value.exportCSV();
}

onMounted(() => {
  mgr.loadLogs();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <OperLogSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <span />
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
        :value="mgr.logs"
        data-key="id"
        :loading="mgr.loading"
        :paginator="true"
        :rows="mgr.pageSize"
        :total-records="mgr.totalRecords"
        :lazy="true"
        :sort-field="mgr.sortField"
        :sort-order="mgr.sortOrder"
        scrollable
        scroll-height="flex"
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条记录，当前第 {first} 到 {last} 条"
        @page="mgr.onPage"
        @sort="mgr.onSort"
      >
        <PrimeColumn
          field="userName"
          header="操作人员"
          style="min-width: 110px"
          sortable
        />

        <PrimeColumn
          field="operationTime"
          header="操作时间"
          style="min-width: 180px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.operationTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="module"
          header="操作模块"
          style="min-width: 110px"
          sortable
        />

        <PrimeColumn
          field="operationType"
          header="操作类型"
          style="min-width: 90px"
          sortable
        />

        <PrimeColumn
          field="title"
          header="业务名称"
          style="min-width: 180px"
          sortable
        />

        <PrimeColumn
          field="requestMethod"
          header="请求方式"
          style="min-width: 90px"
        >
          <template #body="{ data }">
            <PrimeTag :value="data.requestMethod" severity="info" />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="ipAddress"
          header="操作IP"
          style="min-width: 130px"
        />

        <PrimeColumn
          field="status"
          header="操作状态"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.statusLabels[data.status]"
              :severity="mgr.getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="duration"
          header="耗时"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ mgr.formatDuration(data.duration) }}</span>
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
              label="详情"
              size="small"
              severity="secondary"
              outlined
              @click="mgr.viewDetail(data)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <OperLogDetailDialog />
  </div>
</template>
