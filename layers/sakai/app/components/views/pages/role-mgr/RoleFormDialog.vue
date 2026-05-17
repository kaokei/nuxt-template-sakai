<script lang="ts" setup>
import type { Menu } from '@sakai/services/MenuAdminService';
import { MenuAdminService } from '@sakai/services/MenuAdminService';
import { RoleService, type Role } from '@sakai/services/RoleService';
import { DeptService, type SelectOption } from '@sakai/services/DeptService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Role | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const roleService = useService(RoleService);
const menuAdminService = useService(MenuAdminService);
const deptService = useService(DeptService);
const submitted = ref(false);

const dataScopeOptions = [
  { label: '全部数据', value: 'all' },
  { label: '本部门及以下', value: 'deptAndBelow' },
  { label: '本部门', value: 'dept' },
  { label: '本人', value: 'self' },
  { label: '自定义', value: 'custom' },
];

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const form = ref({
  name: '',
  code: '',
  order: 0,
  dataScope: 'all' as Role['dataScope'],
  deptIds: [] as string[],
  status: 'active' as Role['status'],
  remark: '',
});

const isEdit = computed(() => !!editData.value);
const isCustomScope = computed(() => form.value.dataScope === 'custom');
const deptOptions = ref<SelectOption[]>([]);

// 菜单权限树
const menuTreeNodes = ref<any[]>([]);
const selectedMenuKeys = ref<Record<string, { checked: boolean }>>({});
const allMenus = ref<Menu[]>([]);

function buildMenuTree(menus: Menu[], parentId: string | null): any[] {
  return menus
    .filter((m) => m.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((m) => ({
      key: m.id,
      label: m.name,
      data: m,
      children: buildMenuTree(menus, m.id),
    }));
}

onMounted(async () => {
  allMenus.value = await menuAdminService.queryMenus();
  menuTreeNodes.value = buildMenuTree(allMenus.value, null);
});

watch(visible, async (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    deptOptions.value = await deptService.getDeptOptions();
    if (editData.value) {
      form.value = {
        name: editData.value.name,
        code: editData.value.code,
        order: editData.value.order,
        dataScope: editData.value.dataScope,
        deptIds: [...editData.value.deptIds],
        status: editData.value.status,
        remark: editData.value.remark || '',
      };
      // 根据 editData.menuIds 初始化选中菜单
      const keys: Record<string, { checked: boolean }> = {};
      for (const id of editData.value.menuIds) {
        keys[id] = { checked: true };
      }
      selectedMenuKeys.value = keys;
    } else {
      form.value = {
        name: '',
        code: '',
        order: 0,
        dataScope: 'all',
        deptIds: [],
        status: 'active',
        remark: '',
      };
      selectedMenuKeys.value = {};
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

  const checkedMenuIds = Object.entries(selectedMenuKeys.value)
    .filter(([, v]) => v?.checked)
    .map(([k]) => k);

  const payload: Record<string, any> = {
    name: form.value.name.trim(),
    code: form.value.code.trim(),
    order: form.value.order,
    dataScope: form.value.dataScope,
    menuIds: checkedMenuIds,
    status: form.value.status,
    remark: form.value.remark.trim() || undefined,
  };

  // 仅自定义数据权限时传 deptIds
  if (form.value.dataScope === 'custom') {
    payload.deptIds = form.value.deptIds;
  } else {
    payload.deptIds = [];
  }

  try {
    if (isEdit.value && editData.value) {
      await roleService.updateRole(editData.value.id, payload);
    } else {
      await roleService.createRole(payload as Omit<Role, 'id' | 'createTime'>);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存角色失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑角色' : '新增角色'"
    :modal="true"
    :style="{ width: '750px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >角色名称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.name"
            placeholder="输入角色名称"
            :invalid="submitted && !form.name"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.name" class="text-red-500"
            >角色名称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >权限字符 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.code"
            placeholder="如 admin, editor"
            :invalid="submitted && !form.code"
            fluid
          />
          <small v-if="submitted && !form.code" class="text-red-500"
            >权限字符不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">显示顺序</label>
          <PrimeInputNumber v-model="form.order" :min="0" :step="1" fluid />
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
          <label class="mb-2 block text-sm font-medium">数据权限范围</label>
          <PrimeSelect
            v-model="form.dataScope"
            :options="dataScopeOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </div>
      </div>

      <!-- 自定义数据权限：部门多选 -->
      <div v-if="isCustomScope">
        <label class="mb-2 block text-sm font-medium">选择部门</label>
        <PrimeMultiSelect
          v-model="form.deptIds"
          :options="deptOptions"
          option-label="label"
          option-value="value"
          placeholder="请选择部门"
          display="chip"
          fluid
        />
      </div>

      <!-- 菜单权限树 -->
      <div>
        <label class="mb-2 block text-sm font-medium">菜单权限</label>
        <PrimeTree
          v-model:selectionKeys="selectedMenuKeys"
          :value="menuTreeNodes"
          selection-mode="checkbox"
          class="border-surface-200 max-h-64 overflow-auto rounded border p-2"
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注</label>
        <PrimeTextarea v-model="form.remark" rows="2" fluid />
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
