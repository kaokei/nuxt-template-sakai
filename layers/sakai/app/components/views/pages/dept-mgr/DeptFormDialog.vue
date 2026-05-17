<script lang="ts" setup>
import {
  DeptService,
  type Dept,
  type SelectOption,
} from '@sakai/services/DeptService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Dept | null>('editData', { default: null });

const props = defineProps<{
  defaultParentId?: string | null;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const deptService = useService(DeptService);
const submitted = ref(false);
const selectedLeader = ref<SelectOption | null>(null);
const parentName = ref('根部门');

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const isEdit = computed(() => !!editData.value);

const form = ref({
  parentId: null as string | null,
  name: '',
  leader: '',
  leaderId: '',
  phone: '',
  email: '',
  order: 0,
  status: 'active' as Dept['status'],
  remark: '',
});

function resetForm() {
  form.value = {
    parentId: null,
    name: '',
    leader: '',
    leaderId: '',
    phone: '',
    email: '',
    order: 0,
    status: 'active',
    remark: '',
  };
  selectedLeader.value = null;
}

watch(visible, async (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        parentId: editData.value.parentId,
        name: editData.value.name,
        leader: editData.value.leader,
        leaderId: editData.value.leaderId ?? '',
        phone: editData.value.phone,
        email: editData.value.email,
        order: editData.value.order,
        status: editData.value.status,
        remark: editData.value.remark,
      };
      parentName.value = editData.value.parentId
        ? (await deptService.getDeptById(editData.value.parentId))?.name ||
          editData.value.parentId
        : '根部门';
      // 编辑时用已有 leader 信息预填 AutoComplete 显示
      if (editData.value.leaderId && editData.value.leader) {
        selectedLeader.value = {
          label: editData.value.leader,
          value: editData.value.leaderId,
        };
      }
    } else {
      resetForm();
      if (props.defaultParentId) {
        form.value.parentId = props.defaultParentId;
        parentName.value =
          (await deptService.getDeptById(props.defaultParentId))?.name ||
          props.defaultParentId;
      } else {
        parentName.value = '根部门';
      }
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (!form.value.name.trim()) return;

  // 从 AutoComplete 选中结果提取用户信息
  if (selectedLeader.value) {
    form.value.leaderId = selectedLeader.value.value;
    form.value.leader = selectedLeader.value.label;
  }

  try {
    if (isEdit.value && editData.value) {
      await deptService.updateDept(editData.value.id, form.value);
    } else {
      await deptService.createDept(form.value);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存部门失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑部门' : '新增部门'"
    :modal="true"
    :style="{ width: '600px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="mb-2 block text-sm font-medium">上级部门</label>
        <PrimeInputText :model-value="parentName" readonly disabled fluid />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium"
          >部门名称 <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model.trim="form.name"
          placeholder="输入部门名称"
          :invalid="submitted && !form.name"
          fluid
          autofocus
        />
        <small v-if="submitted && !form.name" class="text-red-500"
          >部门名称不能为空</small
        >
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">负责人</label>
          <UserPicker v-model="selectedLeader" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">联系电话</label>
          <PrimeInputText
            v-model.trim="form.phone"
            placeholder="输入联系电话"
            fluid
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">邮箱</label>
          <PrimeInputText
            v-model.trim="form.email"
            placeholder="输入邮箱"
            fluid
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">显示排序</label>
          <PrimeInputNumber v-model="form.order" :min="0" :step="1" fluid />
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

        <div />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注</label>
        <PrimeTextarea
          v-model="form.remark"
          rows="3"
          placeholder="输入备注信息"
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
