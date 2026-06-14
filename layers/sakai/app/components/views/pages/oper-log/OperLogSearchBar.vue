<script lang="ts" setup>
import {
  OperLogService,
  type SelectOption,
} from '@sakai/services/OperLogService';

const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const operLogService = useService(OperLogService);

const searchForm = ref({
  userName: '',
  module: '',
  operationType: '',
  status: '',
  operationTimeRange: null as Date[] | null,
});

const moduleOptions = ref<SelectOption[]>([]);
const operationTypeOptions = ref<SelectOption[]>([]);
const statusOptions = ref<SelectOption[]>([]);

onMounted(async () => {
  moduleOptions.value = await operLogService.getModuleOptions();
  operationTypeOptions.value = await operLogService.getOperationTypeOptions();
  statusOptions.value = await operLogService.getStatusOptions();
});

function handleSearch() {
  const params: Record<string, any> = {};

  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (key === 'operationTimeRange') {
      if (value && (value as Date[]).length === 2) {
        params.operationTimeFrom = (value as Date[])[0];
        params.operationTimeTo = (value as Date[])[1];
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
    module: '',
    operationType: '',
    status: '',
    operationTimeRange: null,
  };
  emit('reset');
}
</script>

<template>
  <div class="search-container">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">操作人员</label>
      <PrimeInputText
        v-model="searchForm.userName"
        placeholder="搜索用户名"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">操作模块</label>
      <PrimeSelect
        v-model="searchForm.module"
        :options="moduleOptions"
        option-label="label"
        option-value="value"
        placeholder="全部"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">操作类型</label>
      <PrimeSelect
        v-model="searchForm.operationType"
        :options="operationTypeOptions"
        option-label="label"
        option-value="value"
        placeholder="全部"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">操作状态</label>
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
      <label class="text-sm font-medium whitespace-nowrap">操作时间</label>
      <PrimeDatePicker
        v-model="searchForm.operationTimeRange"
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
