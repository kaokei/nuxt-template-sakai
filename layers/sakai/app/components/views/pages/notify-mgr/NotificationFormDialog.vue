<script lang="ts" setup>
import type { NotificationMgrService } from '@sakai/services/NotificationMgrService';
import type {
  NotificationType,
  NotificationTargetType,
} from '~/types/notification';

interface SelectOption {
  label: string;
  value: string;
}

const props = defineProps<{
  mgr: NotificationMgrService;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const formData = reactive({
  type: 'system' as NotificationType,
  title: '',
  content: '',
  targetType: 'all' as NotificationTargetType,
  targetIds: [] as string[],
});

const roleOptions: Ref<SelectOption[]> = ref([]);
const userOptions: Ref<SelectOption[]> = ref([]);

async function fetchRoleOptions() {
  try {
    const result = await $fetch<{ data: { id: string; name: string }[] }>(
      '/api/roles',
      { query: { page: '1', pageSize: '100' } },
    );
    roleOptions.value = result.data.map((r) => ({
      label: r.name,
      value: r.id,
    }));
  } catch {
    roleOptions.value = [];
  }
}

async function fetchUserOptions() {
  try {
    const result = await $fetch<{
      data: { id: string; userName: string; nickName: string }[];
    }>('/api/users', { query: { page: '1', pageSize: '200' } });
    userOptions.value = result.data.map((u) => ({
      label: `${u.userName}（${u.nickName}）`,
      value: u.id,
    }));
  } catch {
    userOptions.value = [];
  }
}

function buildTargetDesc(): string {
  if (formData.targetType === 'all') return '全体用户';
  if (formData.targetType === 'role') {
    const names = roleOptions.value
      .filter((r) => formData.targetIds.includes(r.value))
      .map((r) => r.label);
    return names.length > 0 ? names.join('、') : '未选择';
  }
  if (formData.targetType === 'user') {
    const names = userOptions.value
      .filter((u) => formData.targetIds.includes(u.value))
      .map((u) => u.label);
    return names.length > 0 ? names.join('、') : '未选择';
  }
  return '';
}

function resetForm() {
  formData.type = 'system';
  formData.title = '';
  formData.content = '';
  formData.targetType = 'all';
  formData.targetIds = [];
}

watch(
  () => props.mgr.formDialogVisible,
  (visible) => {
    if (visible) {
      resetForm();
      fetchRoleOptions();
    }
  },
);

watch(
  () => formData.targetType,
  (newType) => {
    formData.targetIds = [];
    if (newType === 'user') {
      fetchUserOptions();
    }
  },
);

const typeOptions = [
  { label: '公告通知', value: 'announcement' },
  { label: '系统通知', value: 'system' },
  { label: '业务通知', value: 'business' },
];

const targetTypeOptions = [
  { label: '全体用户', value: 'all' },
  { label: '按角色', value: 'role' },
  { label: '按用户', value: 'user' },
];

const submitting = ref(false);

async function handleSubmit() {
  if (!formData.title.trim() || !formData.content.trim()) return;

  submitting.value = true;
  try {
    await props.mgr.notificationService.createAndSend({
      type: formData.type,
      title: formData.title.trim(),
      content: formData.content.trim(),
      targetType: formData.targetType,
      targetIds:
        formData.targetType === 'all' ? ['all'] : [...formData.targetIds],
      targetDesc: buildTargetDesc(),
    });
    emit('saved');
  } catch {
    // toast 由页面处理
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="mgr.formDialogVisible"
    header="新建通知"
    :modal="true"
    :style="{ width: '600px' }"
    :closable="!submitting"
  >
    <div class="flex flex-col gap-4 pt-2">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium"
          >标题 <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model="formData.title"
          placeholder="请输入通知标题"
          class="w-full"
          :disabled="submitting"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium"
          >内容 <span class="text-red-500">*</span></label
        >
        <PrimeTextarea
          v-model="formData.content"
          placeholder="请输入通知内容"
          rows="5"
          class="w-full"
          :disabled="submitting"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">通知类型</label>
        <PrimeSelect
          v-model="formData.type"
          :options="typeOptions"
          option-label="label"
          option-value="value"
          show-clear
          fluid
          :disabled="submitting"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">发送目标</label>
        <PrimeSelect
          v-model="formData.targetType"
          :options="targetTypeOptions"
          option-label="label"
          option-value="value"
          show-clear
          fluid
          :disabled="submitting"
        />
      </div>

      <div v-if="formData.targetType === 'role'" class="flex flex-col gap-1">
        <label class="text-sm font-medium">选择角色</label>
        <PrimeMultiSelect
          v-model="formData.targetIds"
          :options="roleOptions"
          option-label="label"
          option-value="value"
          placeholder="请选择角色"
          :filter="true"
          show-clear
          fluid
          :disabled="submitting"
          display="chip"
        />
      </div>

      <div v-if="formData.targetType === 'user'" class="flex flex-col gap-1">
        <label class="text-sm font-medium">选择用户</label>
        <PrimeMultiSelect
          v-model="formData.targetIds"
          :options="userOptions"
          option-label="label"
          option-value="value"
          placeholder="请选择用户"
          :filter="true"
          class="w-full"
          :disabled="submitting"
          display="chip"
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton
        label="取消"
        severity="secondary"
        outlined
        :disabled="submitting"
        @click="mgr.formDialogVisible = false"
      />
      <PrimeButton
        label="发送通知"
        severity="primary"
        icon="pi pi-send"
        :loading="submitting"
        :disabled="!formData.title.trim() || !formData.content.trim()"
        @click="handleSubmit"
      />
    </template>
  </PrimeDialog>
</template>
