<script lang="ts" setup>
import { UserService, type SelectOption } from '@sakai/services/UserService';
import { PostService } from '@sakai/services/PostService';

const emit = defineEmits<{
  search: [params: Record<string, any>];
  reset: [];
}>();

const userService = useService(UserService);
const postService = useService(PostService);

const searchForm = ref({
  userName: '',
  nickName: '',
  phone: '',
  deptId: null as string | null,
  postId: null as string | null,
  status: '',
  createTimeRange: null as Date[] | null,
});

const statusOptions = ref<SelectOption[]>([]);
const postOptions = ref<SelectOption[]>([]);

onMounted(async () => {
  statusOptions.value = await userService.getStatusOptions();
  const postResult = await postService.getList({ pageSize: 100 });
  postOptions.value = postResult.data.map((p) => ({
    label: p.name,
    value: p.id,
  }));
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
    } else if (Array.isArray(value) && value.length > 0) {
      params[key] = value;
    }
  });

  emit('search', params);
}

function handleReset() {
  searchForm.value = {
    userName: '',
    nickName: '',
    phone: '',
    deptId: null as string | null,
    postId: null as string | null,
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
      <label class="text-sm font-medium whitespace-nowrap">部门</label>
      <DeptPicker v-model="searchForm.deptId" placeholder="全部" class="w-52" />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">岗位</label>
      <PrimeSelect
        v-model="searchForm.postId"
        :options="postOptions"
        option-label="label"
        option-value="value"
        placeholder="全部"
        show-clear
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">用户昵称</label>
      <PrimeInputText
        v-model="searchForm.nickName"
        placeholder="搜索昵称"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">手机号</label>
      <PrimeInputText
        v-model="searchForm.phone"
        placeholder="搜索手机号"
        class="w-36"
        @keydown.enter="handleSearch"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="text-sm font-medium whitespace-nowrap">部门</label>
      <DeptPicker v-model="searchForm.deptId" placeholder="全部" class="w-52" />
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
