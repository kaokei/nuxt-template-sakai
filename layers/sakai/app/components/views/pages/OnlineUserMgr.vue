<script lang="ts" setup>
import OnlineUserKickDialog from '@sakai/components/views/pages/online-user/OnlineUserKickDialog.vue';
import OnlineUserSearchBar from '@sakai/components/views/pages/online-user/OnlineUserSearchBar.vue';
import { OnlineUserMgrService } from '@sakai/services/OnlineUserMgrService';

const mgr = useService(OnlineUserMgrService);
const toast = useToast();
const dt = ref();

function exportCSV() {
  dt.value.exportCSV();
}

async function onKicked() {
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '已强制下线',
    life: 3000,
  });
}

onMounted(() => {
  mgr.loadOnlineUsers();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <OnlineUserSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="批量强退"
              icon="pi pi-sign-out"
              severity="danger"
              outlined
              :disabled="!mgr.selectedUsers || mgr.selectedUsers.length === 0"
              @click="mgr.confirmKickBatch"
            />
            <PrimeButton
              label="刷新"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              @click="mgr.refresh"
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
        v-model:selection="mgr.selectedUsers"
        :value="mgr.users"
        data-key="token"
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
        <PrimeColumn selection-mode="multiple" header-style="width: 3rem" />

        <PrimeColumn
          field="token"
          header="会话编号"
          style="min-width: 200px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-xs">{{
              data.token
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="userName"
          header="用户名"
          :frozen="true"
          style="min-width: 100px"
          sortable
        />

        <PrimeColumn
          field="deptName"
          header="部门"
          style="min-width: 100px"
          sortable
        />

        <PrimeColumn
          field="ipAddress"
          header="登录 IP"
          style="min-width: 140px"
          sortable
        />

        <PrimeColumn
          field="location"
          header="登录地点"
          style="min-width: 110px"
        />

        <PrimeColumn field="browser" header="浏览器" style="min-width: 120px" />

        <PrimeColumn field="os" header="操作系统" style="min-width: 120px" />

        <PrimeColumn
          field="loginTime"
          header="登录时间"
          style="min-width: 170px"
          sortable
        >
          <template #body="{ data }">
            {{ mgr.formatDateTime(data.loginTime) }}
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="lastActivityTime"
          header="最后活动"
          style="min-width: 170px"
          sortable
        >
          <template #body="{ data }">
            {{ mgr.formatDateTime(data.lastActivityTime) }}
          </template>
        </PrimeColumn>

        <PrimeColumn field="status" header="状态" style="min-width: 80px">
          <template #body>
            <PrimeTag severity="success" value="在线" />
          </template>
        </PrimeColumn>

        <PrimeColumn
          header="操作"
          :frozen="true"
          align-frozen="right"
          style="min-width: 100px"
          :exportable="false"
        >
          <template #body="{ data }">
            <PrimeButton
              label="强退"
              icon="pi pi-sign-out"
              severity="danger"
              size="small"
              outlined
              @click="mgr.confirmKickSingle(data)"
            />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <OnlineUserKickDialog @kicked="onKicked" />
  </div>
</template>
