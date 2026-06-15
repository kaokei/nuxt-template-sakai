<script lang="ts" setup>
import { ServerMonitorMgrService } from '@sakai/services/ServerMonitorMgrService';

const mgr = useService(ServerMonitorMgrService);

onMounted(() => {
  mgr.loadMonitorInfo();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <div class="text-lg font-semibold">服务监控</div>
      <PrimeButton
        label="刷新"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        @click="mgr.refresh"
      />
    </div>

    <!-- CPU 信息 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">CPU</div>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">核心数</div>
          <div class="text-primary mt-1 text-xl font-bold">
            {{ mgr.monitorInfo?.cpu.cores ?? '--' }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">系统使用率</div>
          <div class="mt-1 text-xl font-bold text-blue-500">
            {{ mgr.formatPercent(mgr.monitorInfo?.cpu.sysUsage ?? 0) }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">用户使用率</div>
          <div class="mt-1 text-xl font-bold text-green-500">
            {{ mgr.formatPercent(mgr.monitorInfo?.cpu.userUsage ?? 0) }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">空闲率</div>
          <div
            class="mt-1 text-xl font-bold"
            :class="
              (mgr.monitorInfo?.cpu.idle ?? 0) > 50
                ? 'text-green-500'
                : 'text-yellow-500'
            "
          >
            {{ mgr.formatPercent(mgr.monitorInfo?.cpu.idle ?? 0) }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">I/O 等待</div>
          <div class="mt-1 text-xl font-bold text-orange-500">
            {{ mgr.formatPercent(mgr.monitorInfo?.cpu.wait ?? 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 内存信息 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">内存</div>
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">总内存</div>
          <div class="mt-1 text-xl font-bold">
            {{ mgr.formatMemory((mgr.monitorInfo?.memory.total ?? 0) * 1024) }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">已用内存</div>
          <div class="mt-1 text-xl font-bold text-blue-500">
            {{ mgr.formatMemory((mgr.monitorInfo?.memory.used ?? 0) * 1024) }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">空闲内存</div>
          <div class="mt-1 text-xl font-bold text-green-500">
            {{ mgr.formatMemory((mgr.monitorInfo?.memory.free ?? 0) * 1024) }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3 text-center">
          <div class="text-muted-color text-xs">使用率</div>
          <div
            class="mt-1 text-xl font-bold"
            :class="
              (mgr.monitorInfo?.memory.usage ?? 0) > 80
                ? 'text-red-500'
                : 'text-green-500'
            "
          >
            {{ mgr.formatPercent(mgr.monitorInfo?.memory.usage ?? 0) }}
          </div>
        </div>
      </div>
    </div>

    <!-- JVM 信息 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">JVM 信息</div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="border-surface rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">基本信息</div>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-color">名称</span
              ><span>{{ mgr.monitorInfo?.jvm.name ?? '--' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">版本</span
              ><span>{{ mgr.monitorInfo?.jvm.version ?? '--' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">厂商</span
              ><span>{{ mgr.monitorInfo?.jvm.vendor ?? '--' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">Home</span
              ><span class="font-mono text-xs">{{
                mgr.monitorInfo?.jvm.home ?? '--'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">启动时间</span
              ><span>{{
                mgr.monitorInfo?.jvm.startTime
                  ? new Date(mgr.monitorInfo!.jvm.startTime).toLocaleString(
                      'zh-CN',
                    )
                  : '--'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">运行时长</span
              ><span>{{
                mgr.formatUptime(mgr.monitorInfo?.jvm.uptime ?? '')
              }}</span>
            </div>
          </div>
        </div>
        <div class="border-surface rounded-lg border p-4">
          <div class="mb-2 text-sm font-medium">堆内存</div>
          <div class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-color">初始大小</span
              ><span>{{
                mgr.formatMemory(mgr.monitorInfo?.jvm.heapInit ?? 0)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">已用大小</span
              ><span class="font-semibold text-blue-500">{{
                mgr.formatMemory(mgr.monitorInfo?.jvm.heapUsed ?? 0)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-color">最大大小</span
              ><span>{{
                mgr.formatMemory(mgr.monitorInfo?.jvm.heapMax ?? 0)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 服务器信息 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">服务器信息</div>
      <div class="grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
        <div class="border-surface rounded-lg border p-3">
          <div class="text-muted-color text-xs">主机名</div>
          <div class="mt-1 font-semibold">
            {{ mgr.monitorInfo?.server.hostName ?? '--' }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3">
          <div class="text-muted-color text-xs">操作系统</div>
          <div class="mt-1 font-semibold">
            {{ mgr.monitorInfo?.server.osName ?? '--' }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3">
          <div class="text-muted-color text-xs">系统架构</div>
          <div class="mt-1 font-mono font-semibold">
            {{ mgr.monitorInfo?.server.osArch ?? '--' }}
          </div>
        </div>
        <div class="border-surface rounded-lg border p-3">
          <div class="text-muted-color text-xs">IP 地址</div>
          <div class="mt-1 font-mono font-semibold">
            {{ mgr.monitorInfo?.server.ipAddress ?? '--' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 系统属性 -->
    <div class="card mb-0! p-4!">
      <div class="mb-3 font-semibold">系统属性</div>
      <PrimeDataTable
        :value="mgr.monitorInfo?.systemProperties ?? []"
        scrollable
        :row-hover="true"
        striped-rows
        class="text-sm"
      >
        <PrimeColumn field="key" header="属性名" style="min-width: 200px">
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ data.key }}</span>
          </template>
        </PrimeColumn>
        <PrimeColumn field="value" header="属性值">
          <template #body="{ data }">
            <span class="font-mono text-xs">{{ data.value }}</span>
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </div>
  </div>
</template>
