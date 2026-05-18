<script lang="ts" setup>
import LoginLogDetailDialog from '@sakai/components/views/pages/login-log/LoginLogDetailDialog.vue';
import LoginLogSearchBar from '@sakai/components/views/pages/login-log/LoginLogSearchBar.vue';
import { LoginLogMgrService } from '@sakai/services/LoginLogMgrService';

const mgr = useService(LoginLogMgrService);
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
    <LoginLogSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <span></span>
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
          header="用户名"
          :frozen="true"
          style="min-width: 120px"
          sortable
        />

        <PrimeColumn
          field="loginTime"
          header="登录时间"
          style="min-width: 180px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.loginTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="ipAddress"
          header="IP地址"
          style="min-width: 140px"
          sortable
        />

        <PrimeColumn
          field="location"
          header="登录地点"
          style="min-width: 120px"
        />

        <PrimeColumn field="browser" header="浏览器" style="min-width: 130px" />

        <PrimeColumn field="os" header="操作系统" style="min-width: 120px" />

        <PrimeColumn
          field="status"
          header="登录状态"
          style="min-width: 100px"
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
          field="message"
          header="提示消息"
          style="min-width: 150px"
        />

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

    <LoginLogDetailDialog />
  </div>
</template>
