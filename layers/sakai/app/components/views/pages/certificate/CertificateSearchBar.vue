<script lang="ts" setup>
interface Option {
  label: string;
  value: string;
}

defineProps<{
  categoryOptions: Option[];
}>();

const emit = defineEmits<{
  search: [params: Record<string, string>];
  reset: [];
}>();

const keyword = ref('');
const category = ref('');

function onSearch() {
  emit('search', {
    keyword: keyword.value,
    category: category.value,
  });
}

function onReset() {
  keyword.value = '';
  category.value = '';
  emit('reset');
}
</script>

<template>
  <div class="flex flex-wrap items-end gap-3">
    <div class="flex flex-col gap-1">
      <label class="text-muted-color text-sm">关键词</label>
      <PrimeInputText
        v-model="keyword"
        placeholder="模板名称"
        class="w-48"
        @keyup.enter="onSearch"
      />
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-muted-color text-sm">分类</label>
      <PrimeSelect
        v-model="category"
        :options="categoryOptions"
        option-label="label"
        option-value="value"
        placeholder="全部分类"
      />
    </div>
    <PrimeButton label="搜索" icon="pi pi-search" @click="onSearch" />
    <PrimeButton
      label="重置"
      icon="pi pi-refresh"
      severity="secondary"
      outlined
      @click="onReset"
    />
  </div>
</template>
