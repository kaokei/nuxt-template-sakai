<script lang="ts" setup>
import AnnouncementFormDialog from '@sakai/components/views/pages/announce-mgr/AnnouncementFormDialog.vue';
import { AnnouncementMgrService } from '@sakai/services/AnnouncementMgrService';
import { AnnouncementService } from '@sakai/services/AnnouncementService';
import type { Announcement } from '~/types/announcement';

declareProviders([AnnouncementService, AnnouncementMgrService]);

const mgr = useService(AnnouncementMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '公告管理' });

const searchForm = reactive({
  keyword: '',
  status: '',
  dateFrom: '',
  dateTo: '',
});

function onSearch() {
  const params: Record<string, any> = {};
  if (searchForm.keyword) params.keyword = searchForm.keyword;
  if (searchForm.status) params.status = searchForm.status;
  if (searchForm.dateFrom)
    params.dateFrom = new Date(searchForm.dateFrom).toISOString();
  if (searchForm.dateTo)
    params.dateTo = new Date(searchForm.dateTo).toISOString();
  mgr.onSearch(params);
}

function onReset() {
  searchForm.keyword = '';
  searchForm.status = '';
  searchForm.dateFrom = '';
  searchForm.dateTo = '';
  mgr.onReset();
}

function onSaved() {
  const result = mgr.onSaved();
  toast.add({
    severity: 'success',
    summary: '成功',
    detail: result.isEdit ? '公告已更新' : '公告已创建',
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

async function handlePublish(row: Announcement) {
  try {
    await mgr.publish(row.id);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已发布',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '发布失败',
      life: 3000,
    });
  }
}

async function handleArchive(row: Announcement) {
  try {
    await mgr.archive(row.id);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '公告已下架',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '下架失败',
      life: 3000,
    });
  }
}

onMounted(() => {
  mgr.loadAnnouncements();
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
            placeholder="搜索标题/摘要"
            class="w-48"
            @keyup.enter="onSearch"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-surface-500 text-xs">状态</label>
          <PrimeSelect
            v-model="searchForm.status"
            :options="[
              { label: '全部', value: '' },
              { label: '草稿', value: 'draft' },
              { label: '定时', value: 'scheduled' },
              { label: '已发布', value: 'published' },
              { label: '已下架', value: 'archived' },
            ]"
            option-label="label"
            option-value="value"
            show-clear
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
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新建公告"
            icon="pi pi-plus"
            severity="primary"
            @click="mgr.openNew"
          />
        </template>
      </PrimeToolbar>

      <PrimeDataTable
        :value="mgr.announcements"
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
          style="min-width: 200px"
          sortable
        />

        <PrimeColumn
          field="status"
          header="状态"
          style="min-width: 90px"
          sortable
        >
          <template #body="{ data }">
            <PrimeTag
              :value="mgr.statusLabels[data.status]"
              :severity="mgr.getStatusSeverity(data.status)"
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="publishedAt"
          header="发布时间"
          style="min-width: 150px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-sm">{{
              mgr.formatDateTime(data.publishedAt)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="createdAt"
          header="创建时间"
          style="min-width: 150px"
          sortable
        >
          <template #body="{ data }">
            <span class="text-sm">{{
              mgr.formatDateTime(data.createdAt)
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn header="操作" style="min-width: 220px" :exportable="false">
          <template #body="{ data }">
            <div class="flex gap-1">
              <template v-if="data.status === 'published'">
                <PrimeButton
                  icon="pi pi-eye"
                  severity="info"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'查看'"
                />
                <PrimeButton
                  icon="pi pi-pencil"
                  severity="warn"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'编辑'"
                  @click="mgr.openEdit(data)"
                />
                <PrimeButton
                  icon="pi pi-times-circle"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'下架'"
                  @click="handleArchive(data)"
                />
              </template>
              <template v-else-if="data.status === 'draft'">
                <PrimeButton
                  icon="pi pi-pencil"
                  severity="warn"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'编辑'"
                  @click="mgr.openEdit(data)"
                />
                <PrimeButton
                  icon="pi pi-send"
                  severity="success"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'发布'"
                  @click="handlePublish(data)"
                />
                <PrimeButton
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'删除'"
                  @click="mgr.confirmDelete(data)"
                />
              </template>
              <template v-else-if="data.status === 'scheduled'">
                <PrimeButton
                  icon="pi pi-pencil"
                  severity="warn"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'编辑'"
                  @click="mgr.openEdit(data)"
                />
                <PrimeButton
                  icon="pi pi-times"
                  severity="secondary"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'取消定时'"
                />
                <PrimeButton
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'删除'"
                  @click="mgr.confirmDelete(data)"
                />
              </template>
              <template v-else-if="data.status === 'archived'">
                <PrimeButton
                  icon="pi pi-eye"
                  severity="info"
                  text
                  rounded
                  size="small"
                  v-tooltip.top="'查看'"
                />
              </template>
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <AnnouncementFormDialog :mgr="mgr" @saved="onSaved" />

    <PrimeConfirmDialog />
  </div>
</template>
