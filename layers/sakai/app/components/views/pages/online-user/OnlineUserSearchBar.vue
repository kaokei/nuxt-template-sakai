<script lang="ts" setup>
const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const searchForm = ref({
  userName: '',
  ipAddress: '',
  location: '',
});

function handleSearch() {
  const params: Record<string, any> = {};

  Object.entries(searchForm.value).forEach(([key, value]) => {
    if (typeof value === 'string' && value !== '') {
      params[key] = value;
    }
  });

  emit('search', params);
}

function handleReset() {
  searchForm.value = {
    userName: '',
    ipAddress: '',
    location: '',
  };
  emit('reset');
}
</script>

<template>
  <div class="search-container">
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
      <label class="text-sm font-medium whitespace-nowrap">IP 地址</label>
      <PrimeInputText
        v-model="searchForm.ipAddress"
        placeholder="搜索 IP 地址"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">登录地点</label>
      <PrimeInputText
        v-model="searchForm.location"
        placeholder="搜索登录地点"
        class="w-36"
        @keydown.enter="handleSearch"
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
