<script lang="ts" setup>
import { NotificationMgrService } from '@sakai/services/NotificationMgrService';
import { NotificationService } from '@sakai/services/NotificationService';
import NotificationFormDialog from '@sakai/components/views/pages/notify-mgr/NotificationFormDialog.vue';
import type { NotificationRecord } from '~/types/notification';

declareProviders([NotificationService, NotificationMgrService]);

const mgr = useService(NotificationMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '通知列表' });

const searchForm = reactive({
  keyword: '',
  type: '',
  sendStatus: '',
  dateRange: null as Date[] | null,
});

function onSearch() {
  const params: Record<string, any> = {};
  if (searchForm.keyword) params.keyword = searchForm.keyword;
  if (searchForm.type) params.type = searchForm.type;
  if (searchForm.sendStatus) params.sendStatus = searchForm.sendStatus;
  const dateRange = searchForm.dateRange;
  if (dateRange && dateRange.length === 2) {
    params.dateFrom = dateRange[0]!.toISOString();
    params.dateTo = dateRange[1]!.toISOString();
  }
  mgr.onSearch(params);
}

function onReset() {
  searchForm.keyword = '';
  searchForm.type = '';
  searchForm.sendStatus = '';
  searchForm.dateRange = null;
  mgr.onReset();
}

async function handleRetry(row: NotificationRecord) {
  try {
    await mgr.retrySend(row.id);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '已重新发送',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '重发失败',
      life: 3000,
    });
  }
}

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: '通知已发送',
    life: 3000,
  });
}

onMounted(() => {
  mgr.loadRecords();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
    >
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">关键词</label>
          <PrimeInputText
            v-model="searchForm.keyword"
            placeholder="搜索标题/内容"
            class="w-48"
            @keyup.enter="onSearch"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">通知类型</label>
          <PrimeSelect
            v-model="searchForm.type"
            :options="[
              { label: '公告', value: 'announcement' },
              { label: '系统', value: 'system' },
              { label: '业务', value: 'business' },
            ]"
            option-label="label"
            option-value="value"
            placeholder="全部"
            show-clear
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">发送状态</label>
          <PrimeSelect
            v-model="searchForm.sendStatus"
            :options="[
              { label: '待发送', value: 'pending' },
              { label: '已发送', value: 'sent' },
              { label: '失败', value: 'failed' },
            ]"
            option-label="label"
            option-value="value"
            placeholder="全部"
            show-clear
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">创建时间</label>
          <PrimeDatePicker
            v-model="searchForm.dateRange"
            selection-mode="range"
            date-format="yy-mm-dd"
            placeholder="选择日期范围"
            show-clear
            class="min-w-60"
          />
        </div>
        <div class="flex gap-2">
          <PrimeButton
            label="查询"
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

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新建通知"
            icon="pi pi-plus"
            severity="primary"
            @click="mgr.openNew"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        :value="mgr.records"
        data-key="id"
        :loading="mgr.loading"
        :paginator="true"
        :rows="mgr.pageSize"
        :total-records="mgr.totalRecords"
        :lazy="true"
        :sort-field="mgr.sortField"
        :sort-order="mgr.sortOrder === '-1' ? -1 : 1"
        scrollable
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条记录"
        @page="mgr.onPage"
        @sort="mgr.onSort"
      >
        <PrimeColumn header="序号" style="width: 60px">
          <template #body="{ index }">
            <span class="text-surface-500 text-sm">{{
              (mgr.page - 1) * mgr.pageSize + index + 1
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="title"
          header="标题"
          :frozen="true"
          style="min-width: 220px"
          sortable
        />

        <PrimeColumn field="type" header="通知类型" sortable>
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.typeLabels[data.type]"
              :severity="mgr.getTypeSeverity(data.type)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn header="发送目标">
          <template #body="{ data }">
            <span class="text-sm">{{ data.targetDesc }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="sendStatus" header="发送状态" sortable>
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.statusLabels[data.sendStatus]"
              :severity="mgr.getStatusSeverity(data.sendStatus)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn header="已读/总数">
          <template #body="{ data }">
            <span class="text-sm"
              >{{ data.readCount }}/{{ data.totalCount }}</span
            >
          </template>
        </PrimeColumn>

        <PrimeColumn field="sentAt" header="发送时间" sortable>
          <template #body="{ data }">
            <span class="text-sm">{{
              mgr.formatDateTime(data.sentAt || data.createdAt)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn header="操作" :exportable="false">
          <template #body="{ data }">
            <div class="flex gap-1">
              <PrimeButton
                icon="pi pi-eye"
                severity="info"
                text
                rounded
                size="small"
                v-tooltip.top="'查看详情'"
                @click="mgr.showDetail(data)"
              />
              <PrimeButton
                v-if="data.sendStatus === 'failed'"
                icon="pi pi-refresh"
                severity="warn"
                text
                rounded
                size="small"
                v-tooltip.top="'重新发送'"
                @click="handleRetry(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <PrimeDialog
      v-model:visible="mgr.detailDialogVisible"
      header="通知详情"
      :modal="true"
      :style="{ width: '500px' }"
    >
      <div v-if="mgr.currentDetail" class="flex flex-col gap-3">
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">标题</span>
          <span class="flex-1 text-sm font-medium">{{
            mgr.currentDetail.title
          }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">类型</span>
          <PrimeTag
            :value="mgr.typeLabels[mgr.currentDetail.type]"
            :severity="mgr.getTypeSeverity(mgr.currentDetail.type)"
          />
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">内容</span>
          <span class="flex-1 text-sm">{{ mgr.currentDetail.content }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">发送目标</span>
          <span class="text-sm">{{ mgr.currentDetail.targetDesc }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">发送状态</span>
          <PrimeTag
            :value="mgr.statusLabels[mgr.currentDetail.sendStatus]"
            :severity="mgr.getStatusSeverity(mgr.currentDetail.sendStatus)"
          />
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">已读/总数</span>
          <span class="text-sm"
            >{{ mgr.currentDetail.readCount }}/{{
              mgr.currentDetail.totalCount
            }}</span
          >
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">发送人</span>
          <span class="text-sm">{{ mgr.currentDetail.senderName }}</span>
        </div>
        <div class="flex gap-4">
          <span class="text-surface-500 w-20 text-sm">发送时间</span>
          <span class="text-sm">{{
            mgr.formatDateTime(
              mgr.currentDetail.sentAt || mgr.currentDetail.createdAt,
            )
          }}</span>
        </div>
      </div>
    </PrimeDialog>

    <NotificationFormDialog :mgr="mgr" @saved="onSaved" />
  </div>
</template>
