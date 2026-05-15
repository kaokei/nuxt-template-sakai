<script lang="ts" setup>
import DictDataDeleteDialog from '@sakai/components/views/pages/dict-mgr/DictDataDeleteDialog.vue';
import DictDataFormDialog from '@sakai/components/views/pages/dict-mgr/DictDataFormDialog.vue';
import DictSearchBar from '@sakai/components/views/pages/dict-mgr/DictSearchBar.vue';
import DictTypeDeleteDialog from '@sakai/components/views/pages/dict-mgr/DictTypeDeleteDialog.vue';
import DictTypeFormDialog from '@sakai/components/views/pages/dict-mgr/DictTypeFormDialog.vue';
import { DictMgrService } from '@sakai/services/DictMgrService';
import { DictService } from '@sakai/services/DictService';

declareProviders([DictService, DictMgrService]);

const mgr = useService(DictMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '字典管理' });

function onTypeSaved() {
  const result = mgr.onTypeSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '字典类型已更新' : '字典类型已创建',
    life: 3000,
  });
}

async function onTypeDeleteConfirm() {
  try {
    const result = await mgr.onTypeDeleteConfirm();
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

function onDataSaved(typeCode: string) {
  mgr.onDataSaved(typeCode);
}

async function onDataDeleteConfirm() {
  try {
    const result = await mgr.onDataDeleteConfirm();
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

function expandAll() {
  mgr.expandAll();
}

function collapseAll() {
  mgr.collapseAll();
}

onMounted(() => {
  mgr.loadTypes();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <DictSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="新增"
              icon="pi pi-plus"
              severity="primary"
              @click="mgr.openNewType"
            />
            <PrimeButton
              label="批量删除"
              icon="pi pi-trash"
              severity="danger"
              outlined
              :disabled="!mgr.selectedTypes || mgr.selectedTypes.length === 0"
              @click="mgr.confirmBatchDeleteType"
            />
          </div>
        </template>
        <template #end>
          <div class="flex gap-2">
            <PrimeButton
              label="展开全部"
              icon="pi pi-angles-down"
              severity="secondary"
              @click="expandAll"
            />
            <PrimeButton
              label="收起全部"
              icon="pi pi-angles-up"
              severity="secondary"
              @click="collapseAll"
            />
            <PrimeButton
              label="导出"
              icon="pi pi-download"
              severity="secondary"
              @click="exportCSV"
            />
          </div>
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        v-model:selection="mgr.selectedTypes"
        v-model:expanded-rows="mgr.expandedRows"
        :value="mgr.dictTypes"
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
        @row-expand="mgr.onRowExpand"
      >
        <PrimeColumn
          selection-mode="multiple"
          :frozen="true"
          style="width: 3rem"
          :exportable="false"
        />

        <PrimeColumn expander style="width: 3rem" />

        <PrimeColumn header="序号" style="min-width: 80px">
          <template #body="{ index }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              (mgr.page - 1) * mgr.pageSize + index + 1
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="name"
          header="字典名称"
          :frozen="true"
          style="min-width: 140px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="code"
          header="字典编码"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold">{{ data.code }}</span>
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
          style="min-width: 150px"
          :exportable="false"
        >
          <template #body="{ data }">
            <div class="flex gap-1">
              <PrimeButton
                v-tooltip.top="'新增数据'"
                icon="pi pi-plus-circle"
                size="small"
                severity="info"
                outlined
                rounded
                @click="mgr.openNewData(data.code)"
              />
              <PrimeButton
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                rounded
                @click="mgr.openEditType(data)"
              />
              <PrimeButton
                icon="pi pi-trash"
                size="small"
                severity="danger"
                outlined
                rounded
                @click="mgr.confirmDeleteType(data)"
              />
            </div>
          </template>
        </PrimeColumn>

        <template #expansion="{ data: typeData }">
          <PrimeDataTable
            :value="mgr.getDataByType(typeData.code)"
            data-key="id"
            striped-rows
          >
            <PrimeColumn
              field="label"
              header="字典标签"
              style="min-width: 120px"
            >
              <template #body="{ data }">
                <span class="font-medium">{{ data.label }}</span>
              </template>
            </PrimeColumn>

            <PrimeColumn
              field="value"
              header="字典键值"
              style="min-width: 100px"
            >
              <template #body="{ data }">
                <PrimeTag :value="data.value" severity="info" />
              </template>
            </PrimeColumn>

            <PrimeColumn
              field="valueType"
              header="值类型"
              style="min-width: 80px"
            >
              <template #body="{ data }">
                <PrimeTag
                  :value="data.valueType === 'number' ? '数字' : '字符串'"
                  :severity="data.valueType === 'number' ? 'warn' : 'info'"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn
              field="extValue"
              header="扩展值"
              style="min-width: 100px"
            >
              <template #body="{ data }">
                <span
                  v-if="data.extValue"
                  class="text-surface-500 dark:text-surface-400 font-mono text-sm"
                  >{{ data.extValue }}</span
                >
                <span
                  v-else
                  class="text-surface-300 dark:text-surface-600 text-sm"
                  >--</span
                >
              </template>
            </PrimeColumn>

            <PrimeColumn field="order" header="排序" style="min-width: 80px" />

            <PrimeColumn
              field="listClass"
              header="回显样式"
              style="min-width: 100px"
            >
              <template #body="{ data }">
                <PrimeTag
                  :value="data.listClass || '默认'"
                  :severity="mgr.listClassSeverity[data.listClass]"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn
              field="isDefault"
              header="是否默认"
              style="min-width: 90px"
            >
              <template #body="{ data }">
                <PrimeTag
                  :value="data.isDefault ? '是' : '否'"
                  :severity="data.isDefault ? 'success' : 'secondary'"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn field="status" header="状态" style="min-width: 80px">
              <template #body="{ data }">
                <PrimeTag
                  :value="mgr.statusLabels[data.status] || data.status"
                  :severity="mgr.getStatusSeverity(data.status)"
                />
              </template>
            </PrimeColumn>

            <PrimeColumn header="操作" style="min-width: 100px">
              <template #body="{ data }">
                <div class="flex gap-1">
                  <PrimeButton
                    icon="pi pi-pencil"
                    size="small"
                    severity="secondary"
                    outlined
                    rounded
                    @click="mgr.openEditData(data)"
                  />
                  <PrimeButton
                    icon="pi pi-trash"
                    size="small"
                    severity="danger"
                    outlined
                    rounded
                    @click="mgr.confirmDeleteData(data)"
                  />
                </div>
              </template>
            </PrimeColumn>
          </PrimeDataTable>
        </template>
      </PrimeDataTable>
    </div>

    <DictTypeFormDialog
      v-model:visible="mgr.typeFormDialogVisible"
      v-model:edit-data="mgr.typeEditData"
      @saved="onTypeSaved"
    />

    <DictTypeDeleteDialog
      v-model:visible="mgr.typeDeleteDialogVisible"
      :mode="mgr.typeDeleteMode"
      :type="mgr.typeDeleteTarget"
      :data-count="mgr.typeDeleteDataCount"
      @confirm="onTypeDeleteConfirm"
    />

    <DictDataFormDialog
      v-model:visible="mgr.dataFormDialogVisible"
      v-model:edit-data="mgr.dataEditData"
      :type-code="mgr.dataFormTypeCode"
      @saved="onDataSaved(mgr.dataFormTypeCode)"
    />

    <DictDataDeleteDialog
      v-model:visible="mgr.dataDeleteDialogVisible"
      :data="mgr.dataDeleteTarget"
      @confirm="onDataDeleteConfirm"
    />
  </div>
</template>
