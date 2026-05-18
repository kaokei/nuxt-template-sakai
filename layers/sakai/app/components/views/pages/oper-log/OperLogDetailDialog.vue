<script lang="ts" setup>
import { OperLogMgrService } from '@sakai/services/OperLogMgrService';

const mgr = useService(OperLogMgrService);

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="mgr.detailDialogVisible"
    header="操作日志详情"
    :modal="true"
    :maximizable="true"
    :style="{ width: '700px' }"
  >
    <div v-if="mgr.detailData" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作人员</span>
          <span class="font-medium">{{ mgr.detailData.userName }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作时间</span>
          <span class="font-medium">{{
            mgr.formatDateTime(mgr.detailData.operationTime)
          }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作模块</span>
          <span class="font-medium">{{ mgr.detailData.module }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作类型</span>
          <span class="font-medium">{{ mgr.detailData.operationType }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">业务名称</span>
          <span class="font-medium">{{ mgr.detailData.title }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">请求方式</span>
          <PrimeTag :value="mgr.detailData.requestMethod" severity="info" />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作IP</span>
          <span class="font-medium">{{ mgr.detailData.ipAddress }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作地点</span>
          <span class="font-medium">{{ mgr.detailData.location }}</span>
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">操作状态</span>
          <PrimeTag
            :value="mgr.statusLabels[mgr.detailData.status]"
            :severity="mgr.getStatusSeverity(mgr.detailData.status)"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-surface-500 text-sm">耗时</span>
          <span class="font-medium">{{
            mgr.formatDuration(mgr.detailData.duration)
          }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-surface-500 text-sm">请求URL</span>
        <code
          class="bg-surface-100 overflow-auto rounded p-3 font-mono text-xs"
          >{{ mgr.detailData.requestUrl }}</code
        >
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-surface-500 text-sm">请求参数</span>
        <pre
          class="bg-surface-100 max-h-48 overflow-auto rounded p-3 text-xs"
        ><code>{{ formatJson(mgr.detailData.requestParams) }}</code></pre>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-surface-500 text-sm">响应结果</span>
        <pre
          class="bg-surface-100 max-h-48 overflow-auto rounded p-3 text-xs"
        ><code>{{ formatJson(mgr.detailData.responseResult) }}</code></pre>
      </div>

      <div v-if="mgr.detailData.errorMsg" class="flex flex-col gap-1">
        <span class="text-surface-500 text-sm">错误信息</span>
        <span class="text-sm text-red-500">{{ mgr.detailData.errorMsg }}</span>
      </div>
    </div>
  </PrimeDialog>
</template>
