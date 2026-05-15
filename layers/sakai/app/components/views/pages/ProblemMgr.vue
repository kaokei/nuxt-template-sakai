<script lang="ts" setup>
import ProblemDeleteDialog from '@sakai/components/views/pages/problem-mgr/ProblemDeleteDialog.vue';
import ProblemFormDialog from '@sakai/components/views/pages/problem-mgr/ProblemFormDialog.vue';
import ProblemSearchBar from '@sakai/components/views/pages/problem-mgr/ProblemSearchBar.vue';
import { ProblemMgrService } from '@sakai/services/ProblemMgrService';

const mgr = useService(ProblemMgrService);
const toast = useToast();
const dt = ref();

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '题目已更新' : '题目已创建',
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
  mgr.loadProblems();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <ProblemSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

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
              :disabled="
                !mgr.selectedProblems || mgr.selectedProblems.length === 0
              "
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
        v-model:selection="mgr.selectedProblems"
        :value="mgr.problems"
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
          style="min-width: 110px"
          sortable
        />

        <PrimeColumn
          field="difficulty"
          header="难度"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.difficultyLabels[data.difficulty]"
              :severity="mgr.getDifficultySeverity(data.difficulty)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="tags"
          header="标签"
          style="min-width: 200px; max-width: 320px"
        >
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
          style="min-width: 110px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.submissions.toLocaleString() }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="timeLimit"
          header="时间限制"
          style="min-width: 110px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.timeLimit }}ms</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="memoryLimit"
          header="内存限制"
          style="min-width: 110px"
          sortable
        >
          <template #body="{ data }">
            <span>{{ data.memoryLimit }}MB</span>
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
          field="lastModifiedTime"
          header="最后修改"
          style="min-width: 175px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-surface-500 dark:text-surface-400 text-sm">{{
              mgr.formatDateTime(data.lastModifiedTime)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="accessLevel"
          header="访问权限"
          style="min-width: 120px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.accessLevelLabels[data.accessLevel]"
              :severity="mgr.getAccessSeverity(data.accessLevel)"
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

    <ProblemFormDialog
      v-model:visible="mgr.formDialogVisible"
      v-model:edit-data="mgr.editData"
      @saved="onSaved"
    />

    <ProblemDeleteDialog
      v-model:visible="mgr.deleteDialogVisible"
      :mode="mgr.deleteMode"
      :problem="mgr.deleteTarget"
      :batch-count="mgr.selectedProblems?.length || 0"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
