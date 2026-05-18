<script lang="ts" setup>
import { SysParamMgrService } from '@sakai/services/SysParamMgrService';

const emit = defineEmits<{
  search: [];
  reset: [];
}>();

const mgr = useService(SysParamMgrService);

const typeOptions = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: 'JSON', value: 'json' },
];

function handleSearch() {
  emit('search');
}

function handleReset() {
  emit('reset');
}
</script>

<template>
  <div
    class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
  >
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">参数名称</label>
      <PrimeInputText
        v-model="mgr.searchName"
        placeholder="搜索名称"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">参数键</label>
      <PrimeInputText
        v-model="mgr.searchKey"
        placeholder="搜索键名"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">类型</label>
      <PrimeSelect
        v-model="mgr.searchType"
        :options="typeOptions"
        option-label="label"
        option-value="value"
        placeholder="选择类型"
        show-clear
      />
    </div>

    <div class="flex gap-2">
      <PrimeButton
        label="搜索"
        icon="pi pi-search"
        size="small"
        @click="handleSearch"
      />
      <PrimeButton
        label="重置"
        icon="pi pi-refresh"
        severity="secondary"
        size="small"
        outlined
        @click="handleReset"
      />
    </div>
  </div>
</template>
