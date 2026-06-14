<script lang="ts" setup>
const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const searchForm = ref({
  cacheName: '',
  type: '',
});

const typeOptions = [
  { label: 'string', value: 'string' },
  { label: 'hash', value: 'hash' },
  { label: 'list', value: 'list' },
  { label: 'set', value: 'set' },
  { label: 'zset', value: 'zset' },
];

function handleSearch() {
  const params: Record<string, any> = {};

  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (value && value !== '') {
      params[key] = value;
    }
  });

  emit('search', params);
}

function handleReset() {
  searchForm.value = {
    cacheName: '',
    type: '',
  };
  emit('reset');
}
</script>

<template>
  <div class="search-container">
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">缓存名称</label>
      <PrimeInputText
        v-model="searchForm.cacheName"
        placeholder="搜索缓存名称"
        class="w-40"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">缓存类型</label>
      <PrimeSelect
        v-model="searchForm.type"
        :options="typeOptions"
        option-label="label"
        option-value="value"
        placeholder="选择类型"
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
