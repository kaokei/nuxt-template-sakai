<script lang="ts" setup>
import {
  LoginLogService,
  type SelectOption,
} from '@sakai/services/LoginLogService';

const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const loginLogService = useService(LoginLogService);

const searchForm = ref({
  userName: '',
  ipAddress: '',
  status: '',
  loginTimeRange: null as Date[] | null,
});

const statusOptions = ref<SelectOption[]>([]);

onMounted(async () => {
  statusOptions.value = await loginLogService.getStatusOptions();
});

function handleSearch() {
  const params: Record<string, any> = {};

  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (key === 'loginTimeRange') {
      if (value && (value as Date[]).length === 2) {
        params.loginTimeFrom = (value as Date[])[0];
        params.loginTimeTo = (value as Date[])[1];
      }
    } else if (typeof value === 'string' && value !== '') {
      params[key] = value;
    }
  });

  emit('search', params);
}

function handleReset() {
  searchForm.value = {
    userName: '',
    ipAddress: '',
    status: '',
    loginTimeRange: null,
  };
  emit('reset');
}
</script>

<template>
  <div
    class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
  >
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">用户名</label>
      <PrimeInputText
        v-model="searchForm.userName"
        placeholder="搜索用户名"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">IP地址</label>
      <PrimeInputText
        v-model="searchForm.ipAddress"
        placeholder="搜索IP地址"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">登录状态</label>
      <PrimeSelect
        v-model="searchForm.status"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="全部"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">登录时间</label>
      <PrimeDatePicker
        v-model="searchForm.loginTimeRange"
        selection-mode="range"
        date-format="yy-mm-dd"
        placeholder="选择范围"
        show-clear
        class="min-w-66"
      />
    </div>

    <div class="flex items-center gap-2">
      <PrimeButton
        label="搜索"
        icon="pi pi-search"
        severity="primary"
        @click="handleSearch"
      />
      <PrimeButton
        label="重置"
        icon="pi pi-refresh"
        severity="secondary"
        outlined
        @click="handleReset"
      />
    </div>
  </div>
</template>
