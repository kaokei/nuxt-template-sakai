<script lang="ts" setup>
import { CacheListMgrService } from '@sakai/services/CacheListMgrService';

const mgr = useService(CacheListMgrService);

const emit = defineEmits<{
  hide: [];
}>();
</script>

<template>
  <PrimeDialog
    v-model:visible="mgr.detailDialogVisible"
    header="缓存详情"
    :modal="true"
    :style="{ width: '560px' }"
    @hide="emit('hide')"
  >
    <div v-if="mgr.detailItem" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div>
          <div class="text-surface-500 text-xs">缓存名称</div>
          <div class="font-mono font-semibold">
            {{ mgr.detailItem.cacheName }}
          </div>
        </div>
        <div>
          <div class="text-surface-500 text-xs">缓存类型</div>
          <div>
            <PrimeTag
              :value="mgr.detailItem.type"
              :severity="
                mgr.detailItem.type === 'string'
                  ? 'info'
                  : mgr.detailItem.type === 'hash'
                    ? 'success'
                    : mgr.detailItem.type === 'list'
                      ? 'warn'
                      : mgr.detailItem.type === 'set'
                        ? 'danger'
                        : 'secondary'
              "
            />
          </div>
        </div>
        <div>
          <div class="text-surface-500 text-xs">键数量</div>
          <div class="font-semibold">{{ mgr.detailItem.keyCount }}</div>
        </div>
        <div>
          <div class="text-surface-500 text-xs">过期时间</div>
          <div class="font-semibold">{{ mgr.detailItem.ttl }}</div>
        </div>
        <div>
          <div class="text-surface-500 text-xs">占用大小</div>
          <div class="font-semibold">{{ mgr.detailItem.size }}</div>
        </div>
        <div>
          <div class="text-surface-500 text-xs">创建时间</div>
          <div>
            {{ new Date(mgr.detailItem.createTime).toLocaleString('zh-CN') }}
          </div>
        </div>
      </div>
      <div>
        <div class="text-surface-500 mb-1 text-xs">备注</div>
        <div class="text-sm">{{ mgr.detailItem.remark }}</div>
      </div>
    </div>

    <template #footer>
      <PrimeButton
        label="关闭"
        icon="pi pi-times"
        severity="secondary"
        outlined
        @click="mgr.onDetailHide"
      />
    </template>
  </PrimeDialog>
</template>
