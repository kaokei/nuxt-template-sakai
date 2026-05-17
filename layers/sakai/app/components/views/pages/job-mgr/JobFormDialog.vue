<script lang="ts" setup>
import type { Job } from '~/types/job';
import { JobService } from '@sakai/services/JobService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Job | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const jobService = useService(JobService);
const submitted = ref(false);

const form = ref({
  name: '',
  group: '',
  cron: '',
  className: '',
  methodName: '',
  params: '',
  remark: '',
});

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        name: editData.value.name,
        group: editData.value.group || '',
        cron: editData.value.cron,
        className: editData.value.className,
        methodName: editData.value.methodName || '',
        params: editData.value.params || '',
        remark: editData.value.remark || '',
      };
    } else {
      form.value = {
        name: '',
        group: '',
        cron: '',
        className: '',
        methodName: '',
        params: '',
        remark: '',
      };
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (!form.value.name.trim()) {
    return;
  }
  if (!form.value.cron.trim()) {
    return;
  }
  if (!form.value.className.trim()) {
    return;
  }

  try {
    const payload: Record<string, any> = {
      name: form.value.name.trim(),
      group: form.value.group.trim() || undefined,
      cron: form.value.cron.trim(),
      className: form.value.className.trim(),
      methodName: form.value.methodName.trim() || undefined,
      params: form.value.params.trim() || undefined,
      remark: form.value.remark.trim() || undefined,
    };

    if (isEdit.value && editData.value) {
      await jobService.update(editData.value.id, payload);
    } else {
      await jobService.create(payload as any);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存任务失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑任务' : '新增任务'"
    :modal="true"
    :style="{ width: '700px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >任务名称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.name"
            placeholder="输入任务名称"
            :invalid="submitted && !form.name"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.name" class="text-red-500"
            >任务名称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">任务组</label>
          <PrimeInputText
            v-model.trim="form.group"
            placeholder="输入任务组"
            fluid
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >Cron 表达式 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.cron"
            placeholder="如: 0 0/5 * * * ?"
            :invalid="submitted && !form.cron"
            fluid
          />
          <small v-if="submitted && !form.cron" class="text-red-500"
            >Cron 表达式不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >执行类 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.className"
            placeholder="输入执行类名"
            :invalid="submitted && !form.className"
            fluid
          />
          <small v-if="submitted && !form.className" class="text-red-500"
            >执行类不能为空</small
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">执行方法</label>
          <PrimeInputText
            v-model.trim="form.methodName"
            placeholder="输入执行方法名"
            fluid
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">参数</label>
          <PrimeInputText
            v-model.trim="form.params"
            placeholder="输入参数"
            fluid
          />
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注</label>
        <PrimeTextarea
          v-model="form.remark"
          rows="3"
          placeholder="输入备注"
          fluid
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton
        label="取消"
        icon="pi pi-times"
        severity="secondary"
        text
        @click="visible = false"
      />
      <PrimeButton label="保存" icon="pi pi-check" @click="handleSave" />
    </template>
  </PrimeDialog>
</template>
