<script lang="ts" setup>
import MenuDeleteDialog from '@sakai/components/views/pages/menu-mgr/MenuDeleteDialog.vue';
import MenuFormDialog from '@sakai/components/views/pages/menu-mgr/MenuFormDialog.vue';
import { MenuMgrService } from '@sakai/services/MenuMgrService';
import { MenuAdminService } from '@sakai/services/MenuAdminService';

declareProviders([MenuAdminService, MenuMgrService]);

const mgr = useService(MenuMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '菜单管理' });

// 搜索扩展字段
const searchStatus = ref<string | null>(null);
const searchCreateTimeRange = ref<Date[] | null>(null);
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '菜单已更新' : '菜单已创建',
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

function handleSearch() {
  const createTimeFrom =
    searchCreateTimeRange.value && searchCreateTimeRange.value.length === 2
      ? searchCreateTimeRange.value[0]!.toISOString()
      : undefined;
  const createTimeTo =
    searchCreateTimeRange.value && searchCreateTimeRange.value.length === 2
      ? searchCreateTimeRange.value[1]!.toISOString()
      : undefined;
  mgr.onSearch({
    keyword: mgr.keyword,
    status: searchStatus.value,
    createTimeFrom,
    createTimeTo,
  });
}

function handleReset() {
  searchStatus.value = null;
  searchCreateTimeRange.value = null;
  mgr.onReset();
}

onMounted(() => {
  mgr.loadMenus();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 搜索栏 -->
    <div
      class="border-surface-200 bg-surface-0 flex items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">菜单名称</label>
        <PrimeInputText
          v-model="mgr.keyword"
          placeholder="搜索菜单"
          class="w-56"
          @keydown.enter="handleSearch"
        />
      </div>
      <div class="flex gap-2">
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
              v-permission="'system:menu:add'"
              label="新增一级菜单"
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
          style="min-width: 220px"
        >
          <template #header>
            <div class="flex items-center gap-1">
              <span>菜单名称</span>
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
            <div class="flex items-center gap-2">
              <NuxtIcon
                v-if="node.data.icon"
                :name="node.data.icon"
                class="text-surface-500 size-4"
              />
              <span
                :class="{
                  'text-surface-500 pl-3 text-sm': node.data.type === 'button',
                }"
              >
                <span
                  v-if="node.data.type === 'button'"
                  class="text-surface-400 mr-1"
                  >├
                </span>
                {{ node.data.name }}
              </span>
            </div>
          </template>
        </PrimeColumn>

        <PrimeColumn field="icon" header="图标" style="width: 80px">
          <template #body="{ node }">
            <NuxtIcon
              v-if="node.data.icon"
              :name="node.data.icon"
              class="size-4"
            />
            <span v-else class="text-surface-400">--</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="type" header="类型" style="width: 100px">
          <template #body="{ node }">
            <PrimeTag
              :value="mgr.typeLabels[node.data.type]"
              :severity="mgr.getTypeSeverity(node.data.type)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn field="route" header="路由地址" style="min-width: 150px">
          <template #body="{ node }">
            <span class="text-sm">{{ node.data.route || '--' }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="permission"
          header="权限标识"
          style="min-width: 160px"
        >
          <template #body="{ node }">
            <span class="font-mono text-sm">{{
              node.data.permission || '--'
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="order" header="排序" style="width: 90px" sortable>
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
          style="width: 160px"
          :exportable="false"
        >
          <template #body="{ node }">
            <div class="flex gap-1">
              <PrimeButton
                v-if="node.data.type !== 'button'"
                v-permission="'system:menu:add'"
                v-tooltip.top="'新增子菜单'"
                icon="pi pi-plus-circle"
                size="small"
                severity="primary"
                text
                rounded
                @click="mgr.openNewChild(node.data)"
              />
              <PrimeButton
                v-permission="'system:menu:edit'"
                v-tooltip.top="'编辑'"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                rounded
                @click="mgr.openEdit(node.data)"
              />
              <PrimeButton
                v-permission="'system:menu:delete'"
                v-tooltip.top="'删除'"
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

    <MenuFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      :default-parent-id="mgr.newMenuParentId"
      @saved="onSaved"
    />

    <MenuDeleteDialog
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
