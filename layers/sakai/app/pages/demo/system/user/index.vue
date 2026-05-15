<script lang="ts" setup>
import UserDeleteDialog from '@sakai/components/views/pages/user-mgr/UserDeleteDialog.vue';
import UserFormDialog from '@sakai/components/views/pages/user-mgr/UserFormDialog.vue';
import UserSearchBar from '@sakai/components/views/pages/user-mgr/UserSearchBar.vue';
import { UserMgrService } from '@sakai/services/UserMgrService';
import { UserService } from '@sakai/services/UserService';

declareProviders([UserService, UserMgrService]);

const mgr = useService(UserMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '用户管理' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '用户已更新' : '用户已创建',
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
  mgr.loadUsers();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <UserSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card !p-4">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
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
              :disabled="!mgr.selectedUsers || mgr.selectedUsers.length === 0"
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
        v-model:selection="mgr.selectedUsers"
        :value="mgr.users"
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
          field="userName"
          header="用户账号"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold">{{
              data.userName
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="nickName"
          header="用户昵称"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.nickName }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="phone"
          header="手机号"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.phone || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="gender" header="性别" style="min-width: 80px">
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.genderLabels[data.gender] || data.gender"
              severity="info"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="deptName"
          header="部门"
          style="min-width: 120px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.deptName || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="roleNames"
          header="角色"
          style="min-width: 200px; max-width: 320px"
        >
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <PrimeTag
                v-for="(role, roleIdx) in data.roleNames"
                :key="roleIdx"
                :value="role"
                severity="info"
                class="text-xs"
              />
            </div>
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

    <UserFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <UserDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      :mode="mgr.deleteMode"
      :user="mgr.deleteTarget"
      :batch-count="mgr.selectedUsers?.length || 0"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
