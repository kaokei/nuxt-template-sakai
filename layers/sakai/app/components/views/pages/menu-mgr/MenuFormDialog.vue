<script lang="ts" setup>
import {
  MenuService,
  type Menu,
  type SelectOption,
} from '@sakai/services/MenuService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Menu | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const menuService = useService(MenuService);
const submitted = ref(false);
const parentOptions = ref<SelectOption[]>([]);

const ICON_OPTIONS = [
  { label: '首页', value: 'i-lucide:home' },
  { label: '设置', value: 'i-lucide:settings' },
  { label: '用户', value: 'i-lucide:users' },
  { label: '盾牌', value: 'i-lucide:shield' },
  { label: '菜单', value: 'i-lucide:menu' },
  { label: '组织', value: 'i-lucide:network' },
  { label: '书籍', value: 'i-lucide:book-open' },
  { label: '铃铛', value: 'i-lucide:bell' },
  { label: '文件', value: 'i-lucide:file-text' },
  { label: '监控', value: 'i-lucide:monitor' },
  { label: '硬盘', value: 'i-lucide:hard-drive' },
  { label: '图表', value: 'i-lucide:bar-chart' },
  { label: '活动', value: 'i-lucide:activity' },
  { label: '布局', value: 'i-lucide:layout' },
  { label: '列表', value: 'i-lucide:list' },
  { label: '文件夹', value: 'i-lucide:folder' },
  { label: '终端', value: 'i-lucide:terminal' },
  { label: '代码', value: 'i-lucide:code' },
  { label: '工具', value: 'i-lucide:tools' },
  { label: '锁', value: 'i-lucide:lock' },
  { label: '标签', value: 'i-lucide:tag' },
  { label: '星星', value: 'i-lucide:star' },
  { label: '搜索', value: 'i-lucide:search' },
  { label: '日历', value: 'i-lucide:calendar' },
  { label: '消息', value: 'i-lucide:message-circle' },
  { label: '链接', value: 'i-lucide:link' },
];

const typeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
];

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' },
];

const isEdit = computed(() => !!editData.value);

const form = ref({
  parentId: null as string | null,
  type: 'menu' as Menu['type'],
  name: '',
  icon: '',
  order: 0,
  status: 'active' as Menu['status'],
  route: '',
  component: '',
  permission: '',
  external: false,
  cache: false,
  visible: true,
});

function resetForm() {
  form.value = {
    parentId: null,
    type: 'menu',
    name: '',
    icon: '',
    order: 0,
    status: 'active',
    route: '',
    component: '',
    permission: '',
    external: false,
    cache: false,
    visible: true,
  };
}

watch(visible, async (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    parentOptions.value = await menuService.getParentOptions();
    if (editData.value) {
      form.value = {
        parentId: editData.value.parentId,
        type: editData.value.type,
        name: editData.value.name,
        icon: editData.value.icon,
        order: editData.value.order,
        status: editData.value.status,
        route: editData.value.route,
        component: editData.value.component,
        permission: editData.value.permission,
        external: editData.value.external,
        cache: editData.value.cache,
        visible: editData.value.visible,
      };
    } else {
      resetForm();
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (!form.value.name.trim()) return;
  if (form.value.type === 'button' && !form.value.permission.trim()) return;

  try {
    const payload: any = { ...form.value };
    if (form.value.type === 'directory' || form.value.type === 'menu') {
      delete payload.permission;
    }
    if (form.value.type !== 'menu') {
      payload.route = '';
      payload.component = '';
      payload.external = false;
      payload.cache = false;
      payload.visible = true;
    }

    if (isEdit.value && editData.value) {
      await menuService.updateMenu(editData.value.id, payload);
    } else {
      await menuService.createMenu(payload);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存菜单失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑菜单' : '新增菜单'"
    :modal="true"
    :style="{ width: '700px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">上级菜单</label>
          <PrimeSelect
            v-model="form.parentId"
            :options="parentOptions"
            option-label="label"
            option-value="value"
            placeholder="根菜单"
            show-clear
            fluid
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >菜单类型 <span class="text-red-500">*</span></label
          >
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
          <label class="mb-2 block text-sm font-medium"
            >菜单名称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.name"
            placeholder="输入菜单名称"
            :invalid="submitted && !form.name"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.name" class="text-red-500"
            >菜单名称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">菜单图标</label>
          <PrimeSelect
            v-model="form.icon"
            :options="ICON_OPTIONS"
            option-label="label"
            option-value="value"
            placeholder="选择图标"
            fluid
          >
            <template #value="slotProps">
              <div class="flex items-center gap-2">
                <NuxtIcon
                  v-if="slotProps.value"
                  :name="slotProps.value"
                  class="size-4"
                />
                <span>{{
                  ICON_OPTIONS.find((o) => o.value === slotProps.value)
                    ?.label || '选择图标'
                }}</span>
              </div>
            </template>
            <template #option="slotProps">
              <div class="flex items-center gap-2">
                <NuxtIcon :name="slotProps.option.value" class="size-4" />
                <span>{{ slotProps.option.label }}</span>
              </div>
            </template>
          </PrimeSelect>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">显示排序</label>
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
      </div>

      <template v-if="form.type === 'menu'">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-2 block text-sm font-medium">路由地址</label>
            <PrimeInputText
              v-model.trim="form.route"
              placeholder="如 /system/user"
              fluid
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium">组件路径</label>
            <PrimeInputText
              v-model.trim="form.component"
              placeholder="如 system/user/index"
              fluid
            />
          </div>
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">权限标识</label>
          <PrimeInputText
            v-model.trim="form.permission"
            placeholder="如 system:user:list"
            fluid
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium">是否外链</label>
            <PrimeToggleSwitch v-model="form.external" />
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm font-medium">是否缓存</label>
            <PrimeToggleSwitch v-model="form.cache" />
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm font-medium">是否可见</label>
            <PrimeToggleSwitch v-model="form.visible" />
          </div>
        </div>
      </template>

      <template v-if="form.type === 'button'">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >权限标识 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.permission"
            placeholder="如 system:user:add"
            :invalid="submitted && !form.permission.trim()"
            fluid
          />
          <small
            v-if="submitted && !form.permission.trim()"
            class="text-red-500"
            >按钮类型必须填写权限标识</small
          >
        </div>
      </template>
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
