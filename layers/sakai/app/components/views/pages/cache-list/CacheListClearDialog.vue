<script lang="ts" setup>
import { CacheListMgrService } from '@sakai/services/CacheListMgrService';

const mgr = useService(CacheListMgrService);
const toast = useToast();

async function onClearConfirm() {
  try {
    const result = await mgr.onClearConfirm();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: result.message,
      life: 3000,
    });
    await new Promise((r) => setTimeout(r, 100));
    mgr.clearDialogVisible = false;
  } catch {
    mgr.clearDialogVisible = false;
    toast.add({
      severity: 'error',
      summary: '失败',
      detail: '清除缓存失败',
      life: 3000,
    });
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="mgr.clearDialogVisible"
    header="清除缓存确认"
    :modal="true"
    :style="{ width: '480px' }"
    @hide="mgr.onClearCancel"
  >
    <div class="flex flex-col gap-4">
      <p class="text-surface-600 text-sm leading-relaxed">
        确认清除以下
        <span class="text-primary font-semibold">{{
          mgr.clearTarget.length
        }}</span>
        个缓存？此操作将从 Redis 中删除对应键。
      </p>

      <div class="bg-surface-50 max-h-40 overflow-y-auto rounded-lg border p-3">
        <div
          v-for="item in mgr.clearTarget"
          :key="item.cacheName"
          class="border-surface-100 flex items-center gap-3 border-b py-2 last:border-b-0"
        >
          <span class="text-sm font-medium">{{ item.cacheName }}</span>
          <span class="text-surface-400 text-xs">{{ item.type }}</span>
          <span class="text-surface-400 text-xs">{{ item.size }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <PrimeButton
        label="取消"
        icon="pi pi-times"
        severity="secondary"
        outlined
        @click="mgr.onClearCancel"
      />
      <PrimeButton
        label="确认清除"
        icon="pi pi-trash"
        severity="danger"
        @click="onClearConfirm"
      />
    </template>
  </PrimeDialog>
</template>
