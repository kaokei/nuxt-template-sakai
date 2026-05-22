<script lang="ts" setup>
import { CacheMonitorMgrService } from '@sakai/services/CacheMonitorMgrService';

const mgr = useService(CacheMonitorMgrService);

onMounted(() => {
  mgr.loadMonitorInfo();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="text-lg font-semibold">缓存监控</div>
      <PrimeButton
        label="刷新"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        @click="mgr.refresh"
      />
    </div>

    <!-- Redis 基础信息 -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">Redis 版本</div>
        <div class="text-2xl font-bold">
          {{ mgr.monitorInfo?.info.version ?? '--' }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          端口 {{ mgr.monitorInfo?.info.port ?? '--' }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">运行模式</div>
        <div class="text-2xl font-bold capitalize">
          {{ mgr.monitorInfo?.info.mode ?? '--' }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          运行 {{ mgr.monitorInfo?.info.uptimeDays ?? '--' }} 天
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">键总数</div>
        <div class="text-2xl font-bold text-purple-500">
          {{ mgr.formatNumber(mgr.monitorInfo?.stats.dbSize ?? 0) }}
        </div>
        <div class="text-surface-400 mt-1 text-xs">
          命中率 {{ mgr.formatHitRate(mgr.monitorInfo?.stats.hitRate ?? 0) }}
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-xs">内存使用</div>
        <div class="text-xl font-bold">
          {{ mgr.monitorInfo?.stats.usedMemoryHuman ?? '--' }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-xs">命中次数</div>
        <div class="text-xl font-bold text-green-500">
          {{ mgr.formatNumber(mgr.monitorInfo?.stats.hits ?? 0) }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-xs">未命中</div>
        <div class="text-xl font-bold text-red-500">
          {{ mgr.formatNumber(mgr.monitorInfo?.stats.misses ?? 0) }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-xs">命中率</div>
        <div
          class="text-xl font-bold"
          :class="mgr.getHitRateClass(mgr.monitorInfo?.stats.hitRate ?? 0)"
        >
          {{ mgr.formatHitRate(mgr.monitorInfo?.stats.hitRate ?? 0) }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-xs">连接客户端</div>
        <div class="text-xl font-bold text-blue-500">
          {{ mgr.formatNumber(mgr.monitorInfo?.perf.connectedClients ?? 0) }}
        </div>
      </div>
    </div>

    <!-- 性能信息 -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-2">
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">命令处理总数</div>
        <div class="text-2xl font-bold text-blue-500">
          {{
            mgr.formatNumber(mgr.monitorInfo?.perf.totalCommandsProcessed ?? 0)
          }}
        </div>
      </div>
      <div class="card mb-0! p-4!">
        <div class="text-surface-500 mb-1 text-sm">每秒操作数 (ops/sec)</div>
        <div class="text-2xl font-bold text-green-500">
          {{ mgr.formatNumber(mgr.monitorInfo?.perf.opsPerSec ?? 0) }}
        </div>
      </div>
    </div>

    <!-- 命令统计 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 flex items-center gap-2">
        <span class="font-semibold">命令统计</span>
        <span class="text-surface-400 text-xs"
          >（共 {{ mgr.monitorInfo?.commandStats?.length ?? 0 }} 条）</span
        >
      </div>
      <PrimeDataTable
        :value="mgr.monitorInfo?.commandStats ?? []"
        scrollable
        :row-hover="true"
        striped-rows
        class="text-sm"
      >
        <PrimeColumn field="command" header="命令" style="width: 120px">
          <template #body="{ data }">
            <span class="font-mono text-xs font-semibold">{{
              data.command
            }}</span>
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="calls"
          header="调用次数"
          sortable
          style="width: 120px"
        >
          <template #body="{ data }">
            {{ mgr.formatNumber(data.calls) }}
          </template>
        </PrimeColumn>
        <PrimeColumn
          field="usecPerCall"
          header="平均耗时(μs)"
          sortable
          style="width: 130px"
        >
          <template #body="{ data }">
            <span :class="data.usecPerCall > 100 ? 'text-yellow-500' : ''"
              >{{ data.usecPerCall }} μs</span
            >
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>

    <!-- 详细信息 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 flex items-center gap-2">
        <span class="font-semibold">Redis 详细信息</span>
        <span class="text-surface-400 text-xs"
          >（共 {{ mgr.monitorInfo?.detailInfo?.length ?? 0 }} 条）</span
        >
      </div>
      <PrimeDataTable
        :value="mgr.monitorInfo?.detailInfo ?? []"
        scrollable
        :row-hover="true"
        striped-rows
        class="text-sm"
      >
        <PrimeColumn field="key" header="配置项" style="min-width: 200px">
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ data.key }}</span>
          </template>
        </PrimeColumn>
        <PrimeColumn field="value" header="值">
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ data.value }}</span>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>
  </div>
</template>
