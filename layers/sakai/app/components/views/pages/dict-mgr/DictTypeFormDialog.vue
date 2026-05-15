<script lang="ts" setup>
import { DictService, type DictType } from '@sakai/services/DictService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<DictType | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const dictService = useService(DictService);
const submitted = ref(false);

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const form = ref({
  name: '',
  code: '',
  status: 'active' as DictType['status'],
  remark: '',
});

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        name: editData.value.name,
        code: editData.value.code,
        status: editData.value.status,
        remark: editData.value.remark || '',
      };
    } else {
      form.value = {
        name: '',
        code: '',
        status: 'active',
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
  if (!form.value.code.trim()) {
    return;
  }

  const payload = {
    name: form.value.name.trim(),
    code: form.value.code.trim(),
    status: form.value.status,
    remark: form.value.remark.trim() || undefined,
  };

  try {
    if (isEdit.value && editData.value) {
      await dictService.updateType(editData.value.id, payload);
    } else {
      await dictService.createType(
        payload as Omit<DictType, 'id' | 'createTime'>,
      );
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存字典类型失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑字典类型' : '新增字典类型'"
    :modal="true"
    :style="{ width: '520px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="mb-2 block text-sm font-medium"
          >字典名称 <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model.trim="form.name"
          placeholder="输入字典名称"
          :invalid="submitted && !form.name"
          fluid
          autofocus
        />
        <small v-if="submitted && !form.name" class="text-red-500"
          >字典名称不能为空</small
        >
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium"
          >字典编码 <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model.trim="form.code"
          placeholder="输入字典编码"
          :invalid="submitted && !form.code"
          fluid
        />
        <small v-if="submitted && !form.code" class="text-red-500"
          >字典编码不能为空</small
        >
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">状态</label>
        <PrimeSelect
          v-model="form.status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          fluid
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注</label>
        <PrimeTextarea v-model="form.remark" rows="3" fluid />
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
      <PrimeButton
        label="保存"
        icon="pi pi-check"
        severity="primary"
        @click="handleSave"
      />
    </template>
  </PrimeDialog>
</template>
