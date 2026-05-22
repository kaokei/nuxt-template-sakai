<script lang="ts" setup>
import AreaCodeDeleteDialog from '@sakai/components/views/pages/area-code-mgr/AreaCodeDeleteDialog.vue';
import AreaCodeFormDialog from '@sakai/components/views/pages/area-code-mgr/AreaCodeFormDialog.vue';
import AreaCodeRuleDialog from '@sakai/components/views/pages/area-code-mgr/AreaCodeRuleDialog.vue';
import AreaCodeSearchBar from '@sakai/components/views/pages/area-code-mgr/AreaCodeSearchBar.vue';
import { AreaCodeMgrService } from '@sakai/services/AreaCodeMgrService';
import { AreaCodeService } from '@sakai/services/AreaCodeService';

declareProviders([AreaCodeService, AreaCodeMgrService]);

const mgr = useService(AreaCodeMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '国际区号管理' });

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '区号已更新' : '区号已创建',
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

function onRuleSaved() {
  mgr.onRuleSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '验证规则已保存',
    life: 3000,
  });
}

async function onToggleEnabled(item: (typeof mgr.list)[number]) {
  try {
    await mgr.toggleEnabled(item);
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '状态切换失败',
      life: 3000,
    });
  }
}

async function onBatchEnable() {
  try {
    await mgr.batchEnable();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已批量启用',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '批量启用失败',
      life: 3000,
    });
  }
}

async function onBatchDisable() {
  try {
    await mgr.batchDisable();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已批量禁用',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '批量禁用失败',
      life: 3000,
    });
  }
}

async function onCopyCode(code: string) {
  try {
    await mgr.copyCode(code);
    toast.add({
      severity: 'info',
      summary: '已复制',
      detail: `+${code}`,
      life: 2000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '复制失败',
      detail: '',
      life: 2000,
    });
  }
}

function exportCSV() {
  dt.value.exportCSV();
}

function getContinentSeverity(
  continent: string,
): 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' {
  const map: Record<
    string,
    'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast'
  > = {
    亚洲: 'info',
    欧洲: 'success',
    北美: 'warn',
    南美: 'danger',
    非洲: 'contrast',
    大洋洲: 'secondary',
  };
  return map[continent] || 'info';
}

function getRuleDisplay(rule: string): string {
  if (!rule) return '';
  return rule.length > 18 ? `${rule.slice(0, 18)}...` : rule;
}

onMounted(() => {
  mgr.loadList();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <AreaCodeSearchBar @search="mgr.search" @reset="mgr.onReset" />

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
              :disabled="!mgr.selectedItems || mgr.selectedItems.length === 0"
              @click="mgr.confirmBatchDelete"
            />
            <PrimeButton
              label="批量启用"
              icon="pi pi-check-circle"
              severity="success"
              outlined
              :disabled="!mgr.selectedItems || mgr.selectedItems.length === 0"
              @click="onBatchEnable"
            />
            <PrimeButton
              label="批量禁用"
              icon="pi pi-ban"
              severity="warn"
              outlined
              :disabled="!mgr.selectedItems || mgr.selectedItems.length === 0"
              @click="onBatchDisable"
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
        v-model:selection="mgr.selectedItems"
        :value="mgr.list"
        data-key="id"
        :loading="mgr.loading"
        :rows="mgr.list.length"
        :sort-field="mgr.sortField"
        :sort-order="mgr.sortOrder"
        scrollable
        :row-hover="true"
        striped-rows
        @sort="mgr.onSort"
      >
        <PrimeColumn
          selection-mode="multiple"
          :frozen="true"
          style="width: 3rem"
          :exportable="false"
        />

        <PrimeColumn header="序号" style="min-width: 60px" :exportable="false">
          <template #body="{ index }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">
              {{ index + 1 }}
            </span>
          </template>
        </PrimeColumn>

        <PrimeColumn header="国旗" style="min-width: 60px" :exportable="false">
          <template #body="{ data }">
            <span class="text-xl" :title="data.regionName">
              {{ mgr.getFlagEmoji(data.countryCode) || '🏳' }}
            </span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="code"
          header="区号"
          :frozen="true"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <button
              class="text-primary hover:bg-primary-50 cursor-pointer rounded px-1.5 py-0.5 font-mono font-medium transition-colors"
              :title="`点击复制 +${data.code}`"
              @click="onCopyCode(data.code)"
            >
              +{{ data.code }}
            </button>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="regionName"
          header="地区名称"
          :frozen="true"
          style="min-width: 130px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.regionName }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="countryCode"
          header="国家代码"
          style="min-width: 110px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag :value="data.countryCode" severity="info" />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="englishName"
          header="英文名称"
          style="min-width: 180px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.englishName }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="continent"
          header="大洲"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="data.continent"
              :severity="getContinentSeverity(data.continent)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          header="验证规则"
          style="min-width: 160px"
          :exportable="false"
        >
          <template #body="{ data }">
            <div class="group flex items-center gap-2">
              <span
                v-if="data.validationRule"
                class="text-surface-500 font-mono text-xs"
                :title="data.validationRule"
              >
                {{ getRuleDisplay(data.validationRule) }}
              </span>
              <span v-else class="text-surface-400 text-xs">--</span>
              <span
                class="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <PrimeButton
                  icon="pi pi-pencil"
                  size="small"
                  severity="secondary"
                  outlined
                  rounded
                  @click="mgr.openRuleDialog(data)"
                />
              </span>
            </div>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="enabled"
          header="状态"
          style="min-width: 80px"
          sortable
          :exportable="false"
        >
          <template #body="{ data }">
            <PrimeToggleSwitch
              :model-value="data.enabled"
              @update:model-value="onToggleEnabled(data)"
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
            <span class="text-surface-500 text-sm">{{ data.sort }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          header="操作"
          :frozen="true"
          align-frozen="right"
          style="min-width: 110px"
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

    <AreaCodeFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <AreaCodeRuleDialog
      v-model:visible="mgr.ruleDialogVisible"
      :target="mgr.ruleTarget"
      @saved="onRuleSaved"
    />

    <AreaCodeDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      :mode="mgr.deleteMode"
      :item="mgr.deleteTarget"
      :batch-count="mgr.selectedItems?.length || 0"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
