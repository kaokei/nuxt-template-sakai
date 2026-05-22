<script lang="ts" setup>
import { DataMonitorMgrService } from '@sakai/services/DataMonitorMgrService';

const mgr = useService(DataMonitorMgrService);
const dtSql = ref();
const dtUri = ref();

onMounted(() => {
  mgr.loadAll();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="text-lg font-semibold">数据监控</div>
      <PrimeButton
        label="刷新"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        @click="mgr.refresh"
      />
    </div>

    <!-- 连接池统计卡片 -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">活跃连接数</div>
        <div class="text-primary text-2xl font-bold">
          {{ mgr.monitorInfo?.poolStats.activeCount ?? '--' }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          最大 {{ mgr.monitorInfo?.poolStats.maxActive ?? '--' }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">等待队列</div>
        <div
          class="text-2xl font-bold"
          :class="
            (mgr.monitorInfo?.poolStats.waitCount ?? 0) > 0
              ? 'text-yellow-500'
              : 'text-green-500'
          "
        >
          {{ mgr.monitorInfo?.poolStats.waitCount ?? '--' }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          最小空闲 {{ mgr.monitorInfo?.poolStats.minIdle ?? '--' }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">池化峰值</div>
        <div class="text-2xl font-bold text-blue-500">
          {{ mgr.monitorInfo?.poolStats.poolingPeak ?? '--' }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          初始大小 {{ mgr.monitorInfo?.poolStats.initialSize ?? '--' }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">SQL 执行次数</div>
        <div class="text-2xl font-bold text-purple-500">
          {{ mgr.formatNumber(mgr.monitorInfo?.sqlStats.executeCount ?? 0) }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          慢查询
          {{ mgr.formatNumber(mgr.monitorInfo?.sqlStats.slowCount ?? 0) }}
          <span class="mx-1">·</span>
          错误 {{ mgr.monitorInfo?.sqlStats.errorCount ?? 0 }}
        </div>
      </div>
    </div>

    <!-- SQL 执行统计 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">SQL 执行统计</div>
      <PrimeDataTable
        ref="dtSql"
        :value="mgr.sqlList"
        :loading="mgr.sqlLoading"
        :paginator="true"
        :rows="mgr.sqlPageSize"
        :total-records="mgr.sqlTotalRecords"
        :lazy="true"
        :sort-field="mgr.sqlSortField"
        :sort-order="mgr.sqlSortOrder"
        scrollable
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条"
        @page="mgr.onSqlPage"
        @sort="mgr.onSqlSort"
      >
        <PrimeColumn
          field="sql"
          header="SQL 语句"
          sortable
          style="min-width: 300px"
        >
          <template #body="{ data }">
            <div class="max-w-md truncate font-mono text-xs">
              {{ data.sql }}
            </div>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="executeCount"
          header="执行次数"
          sortable
          style="width: 100px"
        />
        <PrimeColumn
          field="avgTime"
          header="平均耗时(ms)"
          sortable
          style="width: 120px"
        >
          <template #body="{ data }">
            <span :class="data.avgTime > 100 ? 'text-yellow-500' : ''">
              {{ mgr.formatMs(data.avgTime) }}
            </span>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="maxTime"
          header="最大耗时(ms)"
          sortable
          style="width: 120px"
        >
          <template #body="{ data }">
            <span :class="data.maxTime > 500 ? 'text-red-500' : ''">
              {{ mgr.formatMs(data.maxTime) }}
            </span>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="errorCount"
          header="错误数"
          sortable
          style="width: 80px"
        />
        <PrimeColumn
          field="slowCount"
          header="慢查询"
          sortable
          style="width: 80px"
        />
        <PrimeColumn
          field="lastExecuteTime"
          header="最后执行时间"
          sortable
          style="width: 160px"
        >
          <template #body="{ data }">
            {{ new Date(data.lastExecuteTime).toLocaleString('zh-CN') }}
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- URI 请求统计 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">URI 请求统计</div>
      <PrimeDataTable
        ref="dtUri"
        :value="mgr.uriList"
        :loading="mgr.uriLoading"
        :paginator="true"
        :rows="mgr.uriPageSize"
        :total-records="mgr.uriTotalRecords"
        :lazy="true"
        :sort-field="mgr.uriSortField"
        :sort-order="mgr.uriSortOrder"
        scrollable
        :row-hover="true"
        striped-rows
        paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rows-per-page-options="[5, 10, 20, 50]"
        current-page-report-template="共 {totalRecords} 条"
        @page="mgr.onUriPage"
        @sort="mgr.onUriSort"
      >
        <PrimeColumn field="uri" header="URI" sortable style="min-width: 250px">
          <template #body="{ data }">
            <span class="font-mono text-sm">{{ data.uri }}</span>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="requestCount"
          header="请求次数"
          sortable
          style="width: 100px"
        />
        <PrimeColumn
          field="avgTime"
          header="平均耗时(ms)"
          sortable
          style="width: 120px"
        >
          <template #body="{ data }">
            <span :class="data.avgTime > 200 ? 'text-yellow-500' : ''">
              {{ mgr.formatMs(data.avgTime) }}
            </span>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="maxTime"
          header="最大耗时(ms)"
          sortable
          style="width: 120px"
        >
          <template #body="{ data }">
            <span :class="data.maxTime > 1000 ? 'text-red-500' : ''">
              {{ mgr.formatMs(data.maxTime) }}
            </span>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="lastRequestTime"
          header="最后请求时间"
          sortable
          style="width: 160px"
        >
          <template #body="{ data }">
            {{ new Date(data.lastRequestTime).toLocaleString('zh-CN') }}
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>
  </div>
</template>
