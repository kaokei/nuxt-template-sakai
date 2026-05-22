<script lang="ts" setup>
import CacheListClearDialog from '@sakai/components/views/pages/cache-list/CacheListClearDialog.vue';
import CacheListDetailDialog from '@sakai/components/views/pages/cache-list/CacheListDetailDialog.vue';
import CacheListSearchBar from '@sakai/components/views/pages/cache-list/CacheListSearchBar.vue';
import { CacheListMgrService } from '@sakai/services/CacheListMgrService';

const mgr = useService(CacheListMgrService);
const dt = ref();

function exportCSV() {
  dt.value.exportCSV();
}

onMounted(() => {
  mgr.loadCacheList();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <CacheListSearchBar @search="mgr.onSearch" @reset="mgr.onReset" />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <div class="flex gap-2">
            <PrimeButton
              label="批量清除"
              icon="pi pi-trash"
              severity="danger"
              outlined
              :disabled="!mgr.selectedItems || mgr.selectedItems.length === 0"
              @click="mgr.confirmClearBatch"
            />
            <PrimeButton
              label="刷新"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              @click="mgr.refresh"
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
        :value="mgr.cacheItems"
        data-key="cacheName"
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
        <PrimeColumn selection-mode="multiple" header-style="width: 3rem" />

        <PrimeColumn
          field="cacheName"
          header="缓存名称"
          sortable
          style="min-width: 160px"
        >
          <template #body="{ data }">
            <span class="font-mono text-sm font-semibold">{{
              data.cacheName
            }}</span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="keyCount" header="键数量" sortable />

        <PrimeColumn field="ttl" header="过期时间" sortable>
          <template #body="{ data }">
            <span :class="data.ttl === '永不过期' ? 'text-green-500' : ''">
              {{ data.ttl }}
            </span>
          </template>
        </PrimeColumn>

        <PrimeColumn field="size" header="占用大小" sortable />

        <PrimeColumn field="type" header="缓存类型" sortable>
          <template #body="{ data }">
            <PrimeTag
              :value="data.type"
              :severity="
                data.type === 'string'
                  ? 'info'
                  : data.type === 'hash'
                    ? 'success'
                    : data.type === 'list'
                      ? 'warn'
                      : data.type === 'set'
                        ? 'danger'
                        : 'secondary'
              "
            />
          </template>
        </PrimeColumn>

        <PrimeColumn
          field="remark"
          header="备注"
          sortable
          style="min-width: 150px"
        />

        <PrimeColumn
          field="createTime"
          header="创建时间"
          sortable
          style="width: 160px"
        >
          <template #body="{ data }">
            {{ new Date(data.createTime).toLocaleString('zh-CN') }}
          </template>
        </PrimeColumn>

        <PrimeColumn header="操作" style="width: 160px">
          <template #body="{ data }">
            <div class="flex gap-2">
              <PrimeButton
                label="详情"
                icon="pi pi-eye"
                severity="info"
                text
                size="small"
                @click="mgr.showDetail(data)"
              />
              <PrimeButton
                label="清除"
                icon="pi pi-trash"
                severity="danger"
                text
                size="small"
                @click="mgr.confirmClearOne(data)"
              />
            </div>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- 清除确认弹窗 -->
    <CacheListClearDialog />

    <!-- 详情弹窗 -->
    <CacheListDetailDialog @hide="mgr.onDetailHide" />
  </div>
</template>
