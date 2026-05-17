<script lang="ts" setup>
import type { SysParam } from '~/types/sys-param';
import { SysParamMgrService } from '@sakai/services/SysParamMgrService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<SysParam | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const mgr = useService(SysParamMgrService);
const submitted = ref(false);

const typeOptions = [
  { label: '字符串', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '布尔', value: 'boolean' },
  { label: 'JSON', value: 'json' },
];

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const form = ref({
  name: '',
  key: '',
  value: '',
  type: 'string' as SysParam['type'],
  group: '',
  sort: 0,
  status: 'active' as SysParam['status'],
  remark: '',
});

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        name: editData.value.name,
        key: editData.value.key,
        value: editData.value.value,
        type: editData.value.type,
        group: editData.value.group || '',
        sort: editData.value.sort,
        status: editData.value.status,
        remark: editData.value.remark || '',
      };
    } else {
      form.value = {
        name: '',
        key: '',
        value: '',
        type: 'string',
        group: '',
        sort: 0,
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
  if (!form.value.key.trim()) {
    return;
  }

  try {
    await mgr.save(form.value);
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存参数失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑参数' : '新增参数'"
    :modal="true"
    :style="{ width: '700px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >参数名称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.name"
            placeholder="输入参数名称"
            :invalid="submitted && !form.name"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.name" class="text-red-500"
            >参数名称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >参数键 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.key"
            placeholder="输入参数键"
            :invalid="submitted && !form.key"
            :disabled="isEdit"
            fluid
          />
          <small v-if="submitted && !form.key" class="text-red-500"
            >参数键不能为空</small
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >参数值 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.value"
            placeholder="输入参数值"
            :invalid="submitted && !form.value"
            fluid
          />
          <small v-if="submitted && !form.value" class="text-red-500"
            >参数值不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">类型</label>
          <PrimeSelect
            v-model="form.type"
            :options="typeOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">分组</label>
          <PrimeInputText
            v-model.trim="form.group"
            placeholder="输入分组"
            fluid
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">排序</label>
          <PrimeInputNumber v-model="form.sort" :min="0" fluid />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
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
