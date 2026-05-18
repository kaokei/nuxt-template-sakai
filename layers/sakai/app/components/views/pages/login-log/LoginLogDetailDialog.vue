<script lang="ts" setup>
import { LoginLogMgrService } from '@sakai/services/LoginLogMgrService';

const mgr = useService(LoginLogMgrService);
</script>

<template>
  <PrimeDialog
    :visible="mgr.detailDialogVisible"
    header="登录日志详情"
    :modal="true"
    :style="{ width: '500px' }"
    @update:visible="mgr.detailDialogVisible = $event"
  >
    <div v-if="mgr.detailData" class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">用户名</label>
        <span class="font-medium">{{ mgr.detailData.userName }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">登录时间</label>
        <span>{{ mgr.formatDateTime(mgr.detailData.loginTime) }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">IP地址</label>
        <span>{{ mgr.detailData.ipAddress }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">登录地点</label>
        <span>{{ mgr.detailData.location }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">浏览器</label>
        <span>{{ mgr.detailData.browser }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">操作系统</label>
        <span>{{ mgr.detailData.os }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">登录状态</label>
        <PrimeTag
          :value="mgr.statusLabels[mgr.detailData.status]"
          :severity="mgr.getStatusSeverity(mgr.detailData.status)"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-surface-500 text-sm">提示消息</label>
        <span>{{ mgr.detailData.message }}</span>
      </div>
    </div>
  </PrimeDialog>
</template>
