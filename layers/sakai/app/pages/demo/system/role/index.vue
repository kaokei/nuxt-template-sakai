<script lang="ts" setup>
import RoleDeleteDialog from '@sakai/components/views/pages/role-mgr/RoleDeleteDialog.vue';
import RoleFormDialog from '@sakai/components/views/pages/role-mgr/RoleFormDialog.vue';
import RoleSearchBar from '@sakai/components/views/pages/role-mgr/RoleSearchBar.vue';
import { MenuAdminService } from '@sakai/services/MenuAdminService';
import { RoleMgrService } from '@sakai/services/RoleMgrService';
import { RoleService } from '@sakai/services/RoleService';

declareProviders([RoleService, RoleMgrService, MenuAdminService]);

const mgr = useService(RoleMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '角色管理' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '角色已更新' : '角色已创建',
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
  mgr.loadRoles();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <RoleSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card p-4!">
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
              :disabled="!mgr.selectedRoles || mgr.selectedRoles.length === 0"
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
        v-model:selection="mgr.selectedRoles"
        :value="mgr.roles"
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
          header="角色名称"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="code"
          header="权限字符"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold">{{ data.code }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="order"
          header="显示顺序"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.order }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="dataScope"
          header="数据权限"
          style="min-width: 140px"
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.dataScopeLabels[data.dataScope] || data.dataScope"
              :severity="mgr.getDataScopeSeverity(data.dataScope)"
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

    <RoleFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <RoleDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      :mode="mgr.deleteMode"
      :role="mgr.deleteTarget"
      :batch-count="mgr.selectedRoles?.length || 0"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
