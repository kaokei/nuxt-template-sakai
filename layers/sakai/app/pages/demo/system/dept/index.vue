<script lang="ts" setup>
import DeptDeleteDialog from '@sakai/components/views/pages/dept-mgr/DeptDeleteDialog.vue';
import DeptFormDialog from '@sakai/components/views/pages/dept-mgr/DeptFormDialog.vue';
import { DeptMgrService } from '@sakai/services/DeptMgrService';
import { DeptService } from '@sakai/services/DeptService';

declareProviders([DeptService, DeptMgrService]);

const mgr = useService(DeptMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '部门管理' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '部门已更新' : '部门已创建',
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

function expandAll() {
  const keys: Record<string, boolean> = {};
  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      keys[n.key] = true;
      if (n.children) walk(n.children);
    }
  };
  walk(mgr.treeNodes);
  mgr.expandedKeys = keys;
}

function collapseAll() {
  mgr.expandedKeys = {};
}

onMounted(() => {
  mgr.loadDepts();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 搜索栏 -->
    <div
      class="border-surface-200 bg-surface-0 flex items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">部门名称</label>
        <PrimeInputText
          v-model="mgr.keyword"
          placeholder="搜索部门"
          class="w-56"
          @keydown.enter="mgr.onSearch(mgr.keyword)"
        />
      </div>
      <div class="flex gap-2">
        <PrimeButton
          label="搜索"
          icon="pi pi-search"
          severity="primary"
          @click="mgr.onSearch(mgr.keyword)"
        />
        <PrimeButton
          label="重置"
          icon="pi pi-refresh"
          severity="secondary"
          outlined
          @click="mgr.onReset"
        />
      </div>
    </div>

    <!-- 工具栏 + 表格 -->
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
              :disabled="!mgr.hasSelection"
              @click="mgr.confirmBatchDelete"
            />
          </div>
        </template>
      </PrimeToolbar>

      <PrimeTreeTable
        v-model:selectionKeys="mgr.selectedNodes"
        v-model:expandedKeys="mgr.expandedKeys"
        :value="mgr.treeNodes"
        :loading="mgr.loading"
        selectionMode="checkbox"
        scrollable
        :row-hover="true"
        class="mt-0"
        @sort="mgr.onSort"
      >
        <PrimeColumn
          :expander="true"
          field="name"
          :frozen="true"
          style="min-width: 200px"
        >
          <template #header>
            <div class="flex items-center gap-1">
              <span>部门名称</span>
              <PrimeButton
                icon="pi pi-angle-double-down"
                size="small"
                severity="secondary"
                text
                rounded
                v-tooltip.top="'展开全部'"
                @click="expandAll"
              />
              <PrimeButton
                icon="pi pi-angle-double-up"
                size="small"
                severity="secondary"
                text
                rounded
                v-tooltip.top="'折叠全部'"
                @click="collapseAll"
              />
            </div>
          </template>
          <template #body="{ node }">
            <span>{{ node.data.name }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="leader" header="负责人" style="width: 100px">
          <template #body="{ node }">
            <span class="text-sm">{{ node.data.leader || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="phone" header="联系电话" style="width: 130px">
          <template #body="{ node }">
            <span class="text-sm">{{ node.data.phone || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="email" header="邮箱" style="width: 180px">
          <template #body="{ node }">
            <span class="text-sm">{{ node.data.email || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="order" header="排序" style="width: 80px" sortable>
          <template #body="{ node }">
            <span class="text-sm">{{ node.data.order }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="status" header="状态" style="width: 90px">
          <template #body="{ node }">
            <PrimeTag
              :value="mgr.statusLabels[node.data.status]"
              :severity="mgr.getStatusSeverity(node.data.status)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn field="createTime" header="创建时间" style="width: 160px">
          <template #body="{ node }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(node.data.createTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          header="操作"
          :frozen="true"
          align-frozen="right"
          style="width: 120px"
          :exportable="false"
        >
          <template #body="{ node }">
            <div class="flex gap-1">
              <PrimeButton
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                rounded
                @click="mgr.openEdit(node.data)"
              />
              <PrimeButton
                icon="pi pi-trash"
                size="small"
                severity="danger"
                outlined
                rounded
                @click="mgr.confirmDelete(node)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeTreeTable>
    </div>

    <DeptFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <DeptDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      :node="mgr.deleteTarget"
      :batch-count="
        Object.keys(mgr.selectedNodes).filter(
          (k) => mgr.selectedNodes[k]?.checked === true,
        ).length
      "
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
