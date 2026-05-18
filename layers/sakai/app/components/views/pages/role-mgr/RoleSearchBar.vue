<script lang="ts" setup>
const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const searchForm = ref({
  name: '',
  code: '',
  status: '',
  createTimeRange: null as Date[] | null,
});

function handleSearch() {
  const params: Record<string, any> = {};

  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (key === 'createTimeRange') {
      if (value && (value as Date[]).length === 2) {
        params.createTimeFrom = (value as Date[])[0];
        params.createTimeTo = (value as Date[])[1];
      }
    } else if (typeof value === 'string' && value !== '') {
      params[key] = value;
    }
  });

  emit('search', params);
}

function handleReset() {
  searchForm.value = {
    name: '',
    code: '',
    status: '',
    createTimeRange: null,
  };
  emit('reset');
}
</script>

<template>
  <div
    class="border-surface-200 bg-surface-0 flex flex-wrap items-center gap-4 rounded-lg border p-4"
  >
    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">角色名称</label>
      <PrimeInputText
        v-model="searchForm.name"
        placeholder="搜索角色"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">权限字符</label>
      <PrimeInputText
        v-model="searchForm.code"
        placeholder="搜索权限字符"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">状态</label>
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
      <label class="text-sm font-medium whitespace-nowrap">创建时间</label>
      <PrimeDatePicker
        v-model="searchForm.createTimeRange"
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
