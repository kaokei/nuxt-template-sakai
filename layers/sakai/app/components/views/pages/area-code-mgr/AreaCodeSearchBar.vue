<script lang="ts" setup>
import { AreaCodeMgrService } from '@sakai/services/AreaCodeMgrService';

const emit = defineEmits<{
  search: [];
  reset: [];
}>();

const mgr = useService(AreaCodeMgrService);

const statusOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' },
];

function handleSearch() {
  emit('search');
}

function handleReset() {
  emit('reset');
}
</script>

<template>
  <div class="search-container">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">地区名称</label>
      <PrimeInputText
        v-model="mgr.searchRegionName"
        placeholder="搜索地区名称"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">区号</label>
      <PrimeInputText
        v-model="mgr.searchCode"
        placeholder="搜索区号"
        class="w-28"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">大洲</label>
      <PrimeSelect
        v-model="mgr.searchContinent"
        :options="mgr.continentOptions"
        option-label="label"
        option-value="value"
        placeholder="选择大洲"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">状态</label>
      <PrimeSelect
        v-model="mgr.searchStatus"
        :options="statusOptions"
        option-label="label"
        option-value="value"
        placeholder="选择状态"
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
        size="small"
        severity="secondary"
        @click="handleReset"
      />
    </div>

    <div class="text-surface-500 ml-auto flex items-center gap-1 text-sm">
      <span>开启</span>
      <span class="font-semibold text-green-600">{{ mgr.enabledCount }}</span>
      <span>/</span>
      <span>全部</span>
      <span class="font-semibold">{{ mgr.totalRecords }}</span>
    </div>
  </div>
</template>
