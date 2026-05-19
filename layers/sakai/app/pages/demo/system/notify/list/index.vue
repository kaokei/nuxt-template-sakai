<script lang="ts" setup>
import { NotificationMgrService } from '@sakai/services/NotificationMgrService';
import { NotificationService } from '@sakai/services/NotificationService';
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
  dateFrom: '',
  dateTo: '',
});

function onSearch() {
  const params: Record<string, any> = {};
  if (searchForm.keyword) params.keyword = searchForm.keyword;
  if (searchForm.type) params.type = searchForm.type;
  if (searchForm.sendStatus) params.sendStatus = searchForm.sendStatus;
  if (searchForm.dateFrom)
    params.dateFrom = new Date(searchForm.dateFrom).toISOString();
  if (searchForm.dateTo)
    params.dateTo = new Date(searchForm.dateTo).toISOString();
  mgr.onSearch(params);
}

function onReset() {
  searchForm.keyword = '';
  searchForm.type = '';
  searchForm.sendStatus = '';
  searchForm.dateFrom = '';
  searchForm.dateTo = '';
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

onMounted(() => {
  mgr.loadRecords();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="card p-4!">
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
              { label: '全部', value: '' },
              { label: '公告', value: 'announcement' },
              { label: '系统', value: 'system' },
              { label: '业务', value: 'business' },
            ]"
            option-label="label"
            option-value="value"
            class="w-28"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">发送状态</label>
          <PrimeSelect
            v-model="searchForm.sendStatus"
            :options="[
              { label: '全部', value: '' },
              { label: '待发送', value: 'pending' },
              { label: '已发送', value: 'sent' },
              { label: '失败', value: 'failed' },
            ]"
            option-label="label"
            option-value="value"
            class="w-28"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">开始日期</label>
          <PrimeInputText
            v-model="searchForm.dateFrom"
            type="date"
            class="w-36"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">结束日期</label>
          <PrimeInputText
            v-model="searchForm.dateTo"
            type="date"
            class="w-36"
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
        <PrimeColumn header="序号" style="min-width: 60px">
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

        <PrimeColumn
          field="type"
          header="通知类型"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.typeLabels[data.type]"
              :severity="mgr.getTypeSeverity(data.type)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn header="发送目标" style="min-width: 130px">
          <template #body="{ data }">
            <span class="text-sm">{{ data.targetDesc }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="sendStatus"
          header="发送状态"
          style="min-width: 100px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.statusLabels[data.sendStatus]"
              :severity="mgr.getStatusSeverity(data.sendStatus)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn header="已读/总数" style="min-width: 100px">
          <template #body="{ data }">
            <span class="text-sm"
              >{{ data.readCount }}/{{ data.totalCount }}</span
            >
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="sentAt"
          header="发送时间"
          style="min-width: 150px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-sm">{{
              mgr.formatDateTime(data.sentAt || data.createdAt)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn header="操作" style="min-width: 120px" :exportable="false">
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
  </div>
</template>
