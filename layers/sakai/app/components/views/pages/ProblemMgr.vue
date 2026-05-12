<script lang="ts" setup>
import type { Problem } from '@sakai/services/ProblemService';
import { ProblemService } from '@sakai/services/ProblemService';

const problemService = useService(ProblemService);
const toast = useToast();
const dt = ref();

// 表格数据状态
const problems = ref<Problem[]>([]);
const totalRecords = ref(0);
const loading = ref(false);
const selectedProblems = ref<Problem[]>();

// 分页参数
const page = ref(1);
const pageSize = ref(10);
const sortField = ref('problemNumber');
const sortOrder = ref<1 | -1>(1);
const searchParams = ref<Record<string, any>>({});

// 弹窗状态
const formDialogVisible = ref(false);
const editData = ref<Problem | null>(null);
const deleteDialogVisible = ref(false);
const deleteMode = ref<'single' | 'batch'>('single');
const deleteTarget = ref<Problem | null>(null);

// 难度和权限的显示映射
const difficultyLabels: Record<string, string> = {
  Easy: '简单',
  Medium: '中等',
  Hard: '困难',
};
const accessLevelLabels: Record<string, string> = {
  Public: '公开',
  Private: '私有',
  Shared: '共享',
};

function getDifficultySeverity(
  difficulty: string,
): 'success' | 'warn' | 'danger' | 'info' {
  const map: Record<string, 'success' | 'warn' | 'danger' | 'info'> = {
    Easy: 'success',
    Medium: 'warn',
    Hard: 'danger',
  };
  return map[difficulty] || 'info';
}

function getAccessSeverity(level: string): 'success' | 'info' | 'warn' {
  const map: Record<string, 'success' | 'info' | 'warn'> = {
    Public: 'success',
    Shared: 'info',
    Private: 'warn',
  };
  return map[level] || 'info';
}

function formatDate(date: Date): string {
  if (!date) return '--';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatDateTime(date: Date): string {
  if (!date) return '--';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

async function loadProblems() {
  loading.value = true;
  try {
    const result = await problemService.queryProblems({
      ...searchParams.value,
      page: page.value,
      pageSize: pageSize.value,
      sortField: sortField.value,
      sortOrder: sortOrder.value,
    });
    problems.value = result.data;
    totalRecords.value = result.total;
  } finally {
    loading.value = false;
  }
}

function onSearch(params: Record<string, any>) {
  searchParams.value = params;
  page.value = 1;
  loadProblems();
}

function onReset() {
  searchParams.value = {};
  page.value = 1;
  loadProblems();
}

function onPage(event: { page: number; first: number; rows: number }) {
  page.value = event.page + 1;
  pageSize.value = event.rows;
  loadProblems();
}

function onSort(event: { sortField: string; sortOrder: 1 | -1 }) {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  loadProblems();
}

function openNew() {
  editData.value = null;
  formDialogVisible.value = true;
}

function openEdit(problem: Problem) {
  editData.value = { ...problem };
  formDialogVisible.value = true;
}

function onSaved() {
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: editData.value ? '题目已更新' : '题目已创建',
    life: 3000,
  });
  loadProblems();
}

function confirmDelete(problem: Problem) {
  deleteMode.value = 'single';
  deleteTarget.value = problem;
  deleteDialogVisible.value = true;
}

function confirmBatchDelete() {
  if (!selectedProblems.value || selectedProblems.value.length === 0) return;
  deleteMode.value = 'batch';
  deleteTarget.value = null;
  deleteDialogVisible.value = true;
}

async function onDeleteConfirm() {
  try {
    if (deleteMode.value === 'single' && deleteTarget.value) {
      await problemService.deleteProblem(deleteTarget.value.id);
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: '题目已删除',
        life: 3000,
      });
    } else {
      const ids = (selectedProblems.value || []).map((p) => p.id);
      await problemService.deleteProblems(ids);
      selectedProblems.value = undefined;
      toast.add({
        severity: 'success',
        summary: '成功',
        detail: `已删除 ${ids.length} 道题目`,
        life: 3000,
      });
    }
    deleteDialogVisible.value = false;
    loadProblems();
  } catch (err) {
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
  loadProblems();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <ProblemSearchBar @search="onSearch" @reset="onReset" />

    <div class="card">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="新增"
              icon="pi pi-plus"
              severity="primary"
              @click="openNew"
            />
            <PrimeButton
              label="批量删除"
              icon="pi pi-trash"
              severity="danger"
              outlined
              :disabled="!selectedProblems || selectedProblems.length === 0"
              @click="confirmBatchDelete"
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
        v-model:selection="selectedProblems"
        :value="problems"
        data-key="id"
        :loading="loading"
        :paginator="true"
        :rows="pageSize"
        :total-records="totalRecords"
        :lazy="true"
        :sort-field="sortField"
        :sort-order="sortOrder"
        scrollable
        scroll-height="calc(100vh - 320px)"
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条记录，当前第 {first} 到 {last} 条"
        @page="onPage"
        @sort="onSort"
      >
        <PrimeColumn
          selection-mode="multiple"
          :frozen="true"
          style="width: 3rem"
          :exportable="false"
        />

        <PrimeColumn
          field="problemNumber"
          header="题目编号"
          :frozen="true"
          style="min-width: 120px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold">{{
              data.problemNumber
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="title"
          header="题目名称"
          :frozen="true"
          style="min-width: 180px"
          sortable
        >
          <template #body="{ data }">
            <span class="font-medium">{{ data.title }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="owner"
          header="所有者"
          style="min-width: 100px"
          sortable
        />

        <PrimeColumn
          field="difficulty"
          header="难度"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="difficultyLabels[data.difficulty]"
              :severity="getDifficultySeverity(data.difficulty)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn field="tags" header="标签" style="min-width: 200px">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-1">
              <PrimeTag
                v-for="tag in data.tags"
                :key="tag"
                :value="tag"
                severity="info"
                class="text-xs"
              />
            </div>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="acceptanceRate"
          header="通过率"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.acceptanceRate }}%</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="submissions"
          header="提交次数"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.submissions.toLocaleString() }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="timeLimit"
          header="时间限制"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.timeLimit }}ms</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="memoryLimit"
          header="内存限制"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.memoryLimit }}MB</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="createTime"
          header="创建时间"
          style="min-width: 160px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              formatDateTime(data.createTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="lastModifiedTime"
          header="最后修改"
          style="min-width: 160px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              formatDateTime(data.lastModifiedTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="accessLevel"
          header="访问权限"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="accessLevelLabels[data.accessLevel]"
              :severity="getAccessSeverity(data.accessLevel)"
            />
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
                @click="openEdit(data)"
              />
              <PrimeButton
                icon="pi pi-trash"
                size="small"
                severity="danger"
                outlined
                rounded
                @click="confirmDelete(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <ProblemFormDialog
      v-model:visible="formDialogVisible"
      v-model:edit-data="editData"
      @saved="onSaved"
    />

    <ProblemDeleteDialog
      v-model:visible="deleteDialogVisible"
      :mode="deleteMode"
      :problem="deleteTarget"
      :batch-count="selectedProblems?.length || 0"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>

<style scoped>
:deep(.p-datatable-scrollable .p-frozen-column) {
  background-color: var(--p-surface-ground);
  z-index: 2;
}
</style>
