<script lang="ts" setup>
import { OnlineUserMgrService } from '@sakai/services/OnlineUserMgrService';

const mgr = useService(OnlineUserMgrService);

const emit = defineEmits<{
  kicked: [];
}>();

function onKickConfirm() {
  mgr.onKickConfirm();
  emit('kicked');
}
</script>

<template>
  <PrimeDialog
    v-model:visible="mgr.kickDialogVisible"
    header="强制下线确认"
    :modal="true"
    :style="{ width: '480px' }"
    @hide="mgr.onKickCancel"
  >
    <div class="flex flex-col gap-4">
      <p class="text-surface-600 text-sm leading-relaxed">
        确认将以下
        <span class="text-primary font-semibold">{{
          mgr.kickTarget.length
        }}</span>
        个在线用户强制下线？此操作将立即中断其会话。
      </p>

      <div class="bg-surface-50 max-h-40 overflow-y-auto rounded-lg border p-3">
        <div
          v-for="user in mgr.kickTarget"
          :key="user.token"
          class="border-surface-100 flex items-center gap-3 border-b py-2 last:border-b-0"
        >
          <span class="text-sm font-medium">{{ user.userName }}</span>
          <span class="text-surface-400 text-xs">{{ user.ipAddress }}</span>
          <span class="text-surface-400 text-xs">{{ user.location }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <PrimeButton
        label="取消"
        icon="pi pi-times"
        severity="secondary"
        outlined
        @click="mgr.onKickCancel"
      />
      <PrimeButton
        label="确认下线"
        icon="pi pi-sign-out"
        severity="danger"
        @click="onKickConfirm"
      />
    </template>
  </PrimeDialog>
</template>
