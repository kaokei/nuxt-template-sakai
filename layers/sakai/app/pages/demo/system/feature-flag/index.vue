<script lang="ts" setup>
import { FeatureFlagAdminService } from '@sakai/services/FeatureFlagAdminService';
import { FeatureFlagMgrService } from '@sakai/services/FeatureFlagMgrService';

declareProviders([FeatureFlagAdminService, FeatureFlagMgrService]);

const mgr = useService(FeatureFlagMgrService);
const toast = useToast();
const dt = ref();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '功能开关管理' });

// ==================== 搜索表单状态 ====================
const searchKey = ref('');
const searchName = ref('');
const searchTag = ref('');
const searchStatus = ref('');
const searchUpdatedAtRange = ref<Date[] | null>(null);

const statusOptions = [
  { label: '活跃', value: 'active' },
  { label: '已归档', value: 'archived' },
];

// ==================== 表单弹窗状态 ====================
const formData = ref(getDefaultFormData());

function getDefaultFormData() {
  return {
    key: '',
    name: '',
    description: '',
    type: 'boolean' as 'boolean' | 'multivariate',
    tags: [] as string[],
    owner: '',
    status: 'active' as 'active' | 'archived',
    rules: {
      dev: {
        strategy: 'on' as 'off' | 'on' | 'gradual' | 'whitelist',
        rolloutPercent: 100,
        userIds: [] as number[],
      },
      staging: {
        strategy: 'on' as 'off' | 'on' | 'gradual' | 'whitelist',
        rolloutPercent: 100,
        userIds: [] as number[],
      },
      prod: {
        strategy: 'off' as 'off' | 'on' | 'gradual' | 'whitelist',
        rolloutPercent: 0,
        userIds: [] as number[],
      },
    },
  };
}

const typeOptions = [
  { label: '布尔', value: 'boolean' },
  { label: '多值', value: 'multivariate' },
];

const envLabels: Record<string, string> = {
  dev: '开发环境',
  staging: '预发环境',
  prod: '生产环境',
};

// 监听 editData 变化，初始化表单
watch(
  () => mgr.editData,
  (val) => {
    if (val) {
      // 编辑模式：从 editData 填充表单
      const rules = val.rules || [];
      const ruleMap: Record<string, any> = {};
      for (const r of rules) {
        ruleMap[r.environment] = r;
      }

      formData.value = {
        key: val.key || '',
        name: val.name || '',
        description: val.description || '',
        type: val.type || 'boolean',
        tags: val.tags ? [...val.tags] : [],
        owner: val.owner || '',
        status: val.status || 'active',
        rules: {
          dev: {
            strategy: ruleMap.dev?.strategy || 'on',
            rolloutPercent: ruleMap.dev?.rolloutPercent ?? 100,
            userIds: ruleMap.dev?.userIds ? [...ruleMap.dev.userIds] : [],
          },
          staging: {
            strategy: ruleMap.staging?.strategy || 'on',
            rolloutPercent: ruleMap.staging?.rolloutPercent ?? 100,
            userIds: ruleMap.staging?.userIds
              ? [...ruleMap.staging.userIds]
              : [],
          },
          prod: {
            strategy: ruleMap.prod?.strategy || 'off',
            rolloutPercent: ruleMap.prod?.rolloutPercent ?? 0,
            userIds: ruleMap.prod?.userIds ? [...ruleMap.prod.userIds] : [],
          },
        },
      };
    } else {
      // 新增模式：重置为默认值
      formData.value = getDefaultFormData();
    }
  },
);

// ==================== 事件处理 ====================

function onSearch() {
  const params: Record<string, any> = {
    key: searchKey.value,
    name: searchName.value,
    tag: searchTag.value,
    status: searchStatus.value,
  };
  if (searchUpdatedAtRange.value && searchUpdatedAtRange.value.length === 2) {
    params.updatedAtFrom = searchUpdatedAtRange.value[0]!.toISOString();
    params.updatedAtTo = searchUpdatedAtRange.value[1]!.toISOString();
  }
  mgr.onSearch(params);
}

function onReset() {
  searchKey.value = '';
  searchName.value = '';
  searchTag.value = '';
  searchStatus.value = '';
  searchUpdatedAtRange.value = null;
  mgr.onReset();
}

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '开关已更新' : '开关已创建',
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

async function saveFlag() {
  try {
    const data = { ...formData.value };
    if (mgr.editData) {
      // 编辑模式
      await mgr.adminService.updateFlag(data.key, {
        name: data.name,
        description: data.description,
        type: data.type,
        tags: data.tags,
        owner: data.owner,
        status: data.status,
      });
      // 更新各环境规则
      for (const env of ['dev', 'staging', 'prod'] as const) {
        const rule = data.rules[env];
        await mgr.adminService.updateFlagRule(data.key, env, {
          strategy: rule.strategy,
          rolloutPercent: rule.rolloutPercent,
          userIds: rule.userIds,
        });
      }
    } else {
      // 新增模式
      await mgr.adminService.createFlag({
        key: data.key,
        name: data.name,
        description: data.description,
        type: data.type,
        tags: data.tags,
        owner: data.owner,
        status: data.status,
      });
      // 创建后更新各环境规则
      for (const env of ['dev', 'staging', 'prod'] as const) {
        const rule = data.rules[env];
        await mgr.adminService.updateFlagRule(data.key, env, {
          strategy: rule.strategy,
          rolloutPercent: rule.rolloutPercent,
          userIds: rule.userIds,
        });
      }
    }
    mgr.formDialogVisible = false;
    onSaved();
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: mgr.editData ? '更新失败' : '创建失败',
      life: 3000,
    });
  }
}

// ==================== 辅助函数 ====================

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: '活跃',
    archived: '已归档',
  };
  return map[status] || status;
}

function getProdRule(data: any) {
  if (!data.rules || !Array.isArray(data.rules)) return null;
  return data.rules.find((r: any) => r.environment === 'prod');
}

onMounted(() => {
  mgr.loadFlags();
  mgr.loadTagOptions();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 搜索栏 -->
    <div
      class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-sm">开关标识</label>
          <PrimeInputText v-model="searchKey" placeholder="搜索开关标识" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-sm">开关名称</label>
          <PrimeInputText v-model="searchName" placeholder="搜索开关名称" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-sm">标签</label>
          <PrimeSelect
            v-model="searchTag"
            :options="mgr.tagOptions"
            option-label="label"
            option-value="value"
            placeholder="选择标签"
            show-clear
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-sm">状态</label>
          <PrimeSelect
            v-model="searchStatus"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            placeholder="选择状态"
            show-clear
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-sm">更新时间</label>
          <PrimeDatePicker
            v-model="searchUpdatedAtRange"
            selection-mode="range"
            date-format="yy-mm-dd"
            placeholder="选择范围"
            show-clear
            class="min-w-66"
          />
        </div>
        <div class="flex gap-2">
          <PrimeButton
            label="搜索"
            icon="pi pi-search"
            severity="primary"
            @click="onSearch"
          />
          <PrimeButton
            label="重置"
            icon="pi pi-refresh"
            severity="secondary"
            outlined
            @click="onReset"
          />
        </div>
      </div>
    </div>

    <!-- 工具栏 + 数据表格 -->
    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            v-permission="'system:feature-flag:add'"
            label="新增开关"
            icon="pi pi-plus"
            severity="primary"
            @click="mgr.openNew"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        ref="dt"
        :value="mgr.flags"
        data-key="key"
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
        <!-- 序号 -->
        <PrimeColumn header="序号" style="min-width: 80px">
          <template #body="{ index }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              (mgr.page - 1) * mgr.pageSize + index + 1
            }}</span>
          </template>
        </PrimeColumn>

        <!-- 开关标识 -->
        <PrimeColumn
          field="key"
          header="开关标识"
          :frozen="true"
          style="min-width: 160px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold">{{ data.key }}</span>
          </template>
        </PrimeColumn>

        <!-- 开关名称 -->
        <PrimeColumn
          field="name"
          header="开关名称"
          :frozen="true"
          style="min-width: 140px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.name }}</span>
          </template>
        </PrimeColumn>

        <!-- 标签 -->
        <PrimeColumn
          field="tags"
          header="标签"
          style="min-width: 200px; max-width: 320px"
        >
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <PrimeTag
                v-for="(tag, tagIdx) in data.tags"
                :key="tagIdx"
                :value="tag"
                severity="info"
                class="text-xs"
              />
            </div>
          </template>
        </PrimeColumn>

        <!-- 类型 -->
        <PrimeColumn field="type" header="类型" style="min-width: 100px">
          <template #body="{ data }">
            <PrimeTag :value="mgr.getTypeLabel(data.type)" severity="info" />
          </template>
        </PrimeColumn>

        <!-- 状态 -->
        <PrimeColumn
          field="status"
          header="状态"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="getStatusLabel(data.status)"
              :severity="mgr.getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <!-- 生产环境 -->
        <PrimeColumn header="生产环境" style="min-width: 130px">
          <template #body="{ data }">
            <template v-if="getProdRule(data)">
              <PrimeTag
                :value="mgr.getStrategyLabel(getProdRule(data).strategy)"
                :severity="mgr.getStrategySeverity(getProdRule(data).strategy)"
              />
              <span
                v-if="getProdRule(data).strategy === 'gradual'"
                class="text-surface-500 ml-1 text-xs"
              >
                {{ getProdRule(data).rolloutPercent }}%
              </span>
            </template>
            <span v-else class="text-surface-400">--</span>
          </template>
        </PrimeColumn>

        <!-- 负责人 -->
        <PrimeColumn
          field="owner"
          header="负责人"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.owner || '--' }}</span>
          </template>
        </PrimeColumn>

        <!-- 更新时间 -->
        <PrimeColumn
          field="updatedAt"
          header="更新时间"
          style="min-width: 175px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.updatedAt)
            }}</span>
          </template>
        </PrimeColumn>

        <!-- 操作列 -->
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
                v-permission="'system:feature-flag:edit'"
                icon="pi pi-pencil"
                size="small"
                severity="secondary"
                outlined
                rounded
                @click="mgr.openEdit(data)"
              />
              <PrimeButton
                v-permission="'system:feature-flag:delete'"
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

    <!-- 新增/编辑弹窗 -->
    <PrimeDialog
      v-model:visible="mgr.formDialogVisible"
      :header="mgr.editData ? '编辑开关' : '新增开关'"
      :modal="true"
      style="width: 50vw"
    >
      <div class="flex flex-col gap-4">
        <!-- 基本信息 -->
        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-1">
            <label for="flagKey" class="text-sm font-medium">开关标识</label>
            <PrimeInputText
              id="flagKey"
              v-model="formData.key"
              :disabled="!!mgr.editData"
              placeholder="如 new_payment"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="flagName" class="text-sm font-medium">开关名称</label>
            <PrimeInputText
              id="flagName"
              v-model="formData.name"
              placeholder="请输入开关名称"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="flagDesc" class="text-sm font-medium">描述</label>
            <PrimeTextarea
              id="flagDesc"
              v-model="formData.description"
              auto-resize
              :rows="3"
              placeholder="请输入描述"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">类型</label>
            <PrimeSelectButton
              v-model="formData.type"
              :options="typeOptions"
              option-label="label"
              option-value="value"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="flagTags" class="text-sm font-medium">标签</label>
            <PrimeMultiSelect
              id="flagTags"
              v-model="formData.tags"
              :options="mgr.tagOptions"
              option-label="label"
              option-value="value"
              placeholder="选择标签"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label for="flagOwner" class="text-sm font-medium">负责人</label>
            <PrimeInputText
              id="flagOwner"
              v-model="formData.owner"
              placeholder="请输入负责人"
            />
          </div>
        </div>

        <!-- 环境配置 -->
        <div class="mt-2">
          <h3 class="mb-3 text-base font-semibold">环境配置</h3>
          <PrimeAccordion value="prod">
            <PrimeAccordionPanel
              v-for="env in ['dev', 'staging', 'prod'] as const"
              :key="env"
              :value="env"
            >
              <PrimeAccordionHeader>{{ envLabels[env] }}</PrimeAccordionHeader>
              <PrimeAccordionContent>
                <div class="flex flex-col gap-3 pt-2">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">发布策略</label>
                    <PrimeSelectButton
                      v-model="formData.rules[env].strategy"
                      :options="mgr.strategyOptions"
                      option-label="label"
                      option-value="value"
                    />
                  </div>

                  <div
                    v-if="formData.rules[env].strategy === 'gradual'"
                    class="flex flex-col gap-1"
                  >
                    <label class="text-sm font-medium">灰度百分比</label>
                    <PrimeInputNumber
                      v-model="formData.rules[env].rolloutPercent"
                      :min="0"
                      :max="100"
                      suffix="%"
                    />
                  </div>

                  <div
                    v-if="formData.rules[env].strategy === 'whitelist'"
                    class="flex flex-col gap-1"
                  >
                    <label class="text-sm font-medium">白名单用户 ID</label>
                    <PrimeChips
                      v-model="formData.rules[env].userIds"
                      placeholder="输入用户 ID 后回车"
                    />
                  </div>
                </div>
              </PrimeAccordionContent>
            </PrimeAccordionPanel>
          </PrimeAccordion>
        </div>
      </div>

      <template #footer>
        <PrimeButton
          label="取消"
          severity="secondary"
          outlined
          @click="mgr.formDialogVisible = false"
        />
        <PrimeButton label="保存" severity="primary" @click="saveFlag" />
      </template>
    </PrimeDialog>

    <!-- 删除确认弹窗 -->
    <PrimeDialog
      v-model:visible="mgr.deleteDialogVisible"
      header="确认删除"
      :modal="true"
      style="width: 30vw"
    >
      <div class="flex items-center gap-3">
        <i class="pi pi-exclamation-triangle text-2xl text-orange-500"></i>
        <span
          >确定要删除开关「{{
            mgr.deleteTarget?.name
          }}」吗？此操作不可撤销。</span
        >
      </div>
      <template #footer>
        <PrimeButton
          label="取消"
          severity="secondary"
          outlined
          @click="mgr.deleteDialogVisible = false"
        />
        <PrimeButton
          label="确认删除"
          severity="danger"
          @click="onDeleteConfirm"
        />
      </template>
    </PrimeDialog>
  </div>
</template>
