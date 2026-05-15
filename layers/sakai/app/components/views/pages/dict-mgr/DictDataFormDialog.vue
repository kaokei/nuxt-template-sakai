<script lang="ts" setup>
import { DictService, type DictData } from '@sakai/services/DictService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<DictData | null>('editData', { default: null });

const props = defineProps<{
  typeCode: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const dictService = useService(DictService);
const submitted = ref(false);

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const listClassOptions = [
  { label: '默认', value: '' },
  { label: '信息', value: 'info' },
  { label: '成功', value: 'success' },
  { label: '警告', value: 'warn' },
  { label: '危险', value: 'danger' },
];

const form = ref({
  label: '',
  value: '',
  valueType: 'string' as DictData['valueType'],
  extValue: '',
  order: 1,
  cssClass: '',
  listClass: '' as DictData['listClass'],
  isDefault: false,
  status: 'active' as DictData['status'],
  remark: '',
});

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        label: editData.value.label,
        value: editData.value.value,
        valueType: editData.value.valueType,
        extValue: editData.value.extValue || '',
        order: editData.value.order,
        cssClass: editData.value.cssClass || '',
        listClass: editData.value.listClass,
        isDefault: editData.value.isDefault,
        status: editData.value.status,
        remark: editData.value.remark || '',
      };
    } else {
      form.value = {
        label: '',
        value: '',
        valueType: 'string',
        extValue: '',
        order: 1,
        cssClass: '',
        listClass: '',
        isDefault: false,
        status: 'active',
        remark: '',
      };
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (!form.value.label.trim()) {
    return;
  }
  if (!form.value.value.trim()) {
    return;
  }

  const payload = {
    typeCode: props.typeCode,
    label: form.value.label.trim(),
    value: form.value.value.trim(),
    valueType: form.value.valueType,
    extValue: form.value.extValue.trim() || undefined,
    order: form.value.order,
    cssClass: form.value.cssClass.trim() || undefined,
    listClass: form.value.listClass,
    isDefault: form.value.isDefault,
    status: form.value.status,
    remark: form.value.remark.trim() || undefined,
  };

  try {
    if (isEdit.value && editData.value) {
      await dictService.updateData(editData.value.id, payload);
    } else {
      await dictService.createData(
        payload as Omit<DictData, 'id' | 'createTime'>,
      );
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存字典数据失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑字典数据' : '新增字典数据'"
    :modal="true"
    :style="{ width: '580px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >字典标签 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.label"
            placeholder="输入字典标签"
            :invalid="submitted && !form.label"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.label" class="text-red-500"
            >字典标签不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >字典键值 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.value"
            placeholder="输入字典键值"
            :invalid="submitted && !form.value"
            fluid
          />
          <small v-if="submitted && !form.value" class="text-red-500"
            >字典键值不能为空</small
          >
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">值类型</label>
        <PrimeSelect
          v-model="form.valueType"
          :options="[
            { label: '字符串', value: 'string' },
            { label: '数字', value: 'number' },
          ]"
          option-label="label"
          option-value="value"
          fluid
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">扩展值</label>
        <PrimeInputText
          v-model.trim="form.extValue"
          placeholder="如状态码、费率等附加数据（选填）"
          fluid
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">排序</label>
          <PrimeInputNumber v-model="form.order" fluid />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">样式类名</label>
          <PrimeInputText
            v-model.trim="form.cssClass"
            placeholder="如 text-primary"
            fluid
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">回显样式</label>
          <PrimeSelect
            v-model="form.listClass"
            :options="listClassOptions"
            option-label="label"
            option-value="value"
            placeholder="选择回显样式"
            fluid
          />
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
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">是否默认</label>
        <PrimeToggleSwitch v-model="form.isDefault" />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注</label>
        <PrimeTextarea v-model="form.remark" rows="3" auto-resize />
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
