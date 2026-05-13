<script lang="ts" setup>
import { ProblemService } from '@sakai/services/ProblemService';

const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const problemService = useService(ProblemService);

const searchForm = ref({
  problemNumber: '',
  title: '',
  owner: '',
  difficulty: '',
  tags: [] as string[],
  accessLevel: '',
  createTimeRange: null as Date[] | null,
});

const allTags = ref<string[]>(problemService.getAllTags());
const difficultyOptions = ref(problemService.getDifficultyOptions());
const accessLevelOptions = ref(problemService.getAccessLevelOptions());
const ownerOptions = ref(problemService.getOwnerOptions());

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
    } else if (Array.isArray(value) && value.length > 0) {
      params[key] = value;
    }
  });

  emit('search', params);
}

function handleReset() {
  searchForm.value = {
    problemNumber: '',
    title: '',
    owner: '',
    difficulty: '',
    tags: [],
    accessLevel: '',
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
      <label class="text-sm font-medium whitespace-nowrap">题目编号</label>
      <PrimeInputText
        v-model="searchForm.problemNumber"
        placeholder="如 OJ-1001"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">题目名称</label>
      <PrimeInputText
        v-model="searchForm.title"
        placeholder="搜索名称"
        class="w-44"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">所有者</label>
      <PrimeSelect
        v-model="searchForm.owner"
        :options="ownerOptions"
        option-label="label"
        option-value="value"
        placeholder="全部"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">难度</label>
      <PrimeSelect
        v-model="searchForm.difficulty"
        :options="difficultyOptions"
        option-label="label"
        option-value="value"
        placeholder="全部"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">标签</label>
      <PrimeMultiSelect
        v-model="searchForm.tags"
        :options="allTags"
        placeholder="选择标签"
        show-clear
        class="max-w-64"
        display="chip"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">访问权限</label>
      <PrimeSelect
        v-model="searchForm.accessLevel"
        :options="accessLevelOptions"
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
