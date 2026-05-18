<script lang="ts" setup>
import type { User } from '@sakai/services/UserService';
import { UserService, type SelectOption } from '@sakai/services/UserService';
import { DeptService } from '@sakai/services/DeptService';
import { PostService } from '@sakai/services/PostService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<User | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const userService = useService(UserService);
const deptService = useService(DeptService);
const postService = useService(PostService);
const submitted = ref(false);

const form = ref({
  userName: '',
  password: '',
  nickName: '',
  phone: '',
  email: '',
  gender: 'male' as User['gender'],
  deptId: '',
  postId: null as string | null,
  roleIds: [] as string[],
  status: 'active' as User['status'],
  remark: '',
});

const roleOptions = ref<SelectOption[]>([]);
const genderOptions = ref<SelectOption[]>([]);
const statusOptions = ref<SelectOption[]>([]);
const postOptions = ref<SelectOption[]>([]);
const isEdit = computed(() => !!editData.value);

onMounted(async () => {
  roleOptions.value = await userService.getRoleOptions();
  genderOptions.value = await userService.getGenderOptions();
  statusOptions.value = await userService.getStatusOptions();
  const postResult = await postService.getList({ pageSize: 100 });
  postOptions.value = postResult.data.map((p) => ({
    label: p.name,
    value: p.id,
  }));
});

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        userName: editData.value.userName,
        password: '',
        nickName: editData.value.nickName,
        phone: editData.value.phone || '',
        email: editData.value.email || '',
        gender: editData.value.gender,
        deptId: editData.value.deptId || '',
        postId: editData.value.postId || null,
        roleIds: [...editData.value.roleIds],
        status: editData.value.status,
        remark: editData.value.remark || '',
      };
    } else {
      form.value = {
        userName: '',
        password: '',
        nickName: '',
        phone: '',
        email: '',
        gender: 'male',
        deptId: '',
        postId: null,
        roleIds: [],
        status: 'active',
        remark: '',
      };
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (!form.value.userName.trim()) {
    return;
  }
  if (!form.value.nickName.trim()) {
    return;
  }
  if (!isEdit.value && !form.value.password.trim()) {
    return;
  }

  try {
    // 从 roleOptions 中映射 roleNames
    const roleNames = form.value.roleIds
      .map((id) => roleOptions.value.find((opt) => opt.value === id)?.label)
      .filter((name): name is string => !!name);

    // 查询 deptName
    let deptName = '';
    if (form.value.deptId) {
      const dept = await deptService.getDeptById(form.value.deptId);
      deptName = dept?.name ?? '';
    }

    const payload: Record<string, any> = {
      userName: form.value.userName.trim(),
      nickName: form.value.nickName.trim(),
      phone: form.value.phone.trim() || undefined,
      email: form.value.email.trim() || undefined,
      gender: form.value.gender,
      deptId: form.value.deptId || undefined,
      deptName: deptName || undefined,
      postId: form.value.postId || undefined,
      postName: postOptions.value.find((o) => o.value === form.value.postId)
        ?.label,
      roleIds: form.value.roleIds,
      roleNames,
      status: form.value.status,
      remark: form.value.remark.trim() || undefined,
    };

    if (!isEdit.value) {
      payload.password = form.value.password;
    } else if (form.value.password.trim()) {
      payload.password = form.value.password;
    }

    if (isEdit.value && editData.value) {
      await userService.updateUser(editData.value.id, payload);
    } else {
      await userService.createUser(payload as Omit<User, 'id' | 'createTime'>);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存用户失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑用户' : '新增用户'"
    :modal="true"
    :style="{ width: '700px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >用户账号 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.userName"
            placeholder="输入用户账号"
            :invalid="submitted && !form.userName"
            :disabled="isEdit"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.userName" class="text-red-500"
            >用户账号不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >密码
            <span v-if="!isEdit" class="text-red-500">*</span>
          </label>
          <PrimeInputText
            v-model="form.password"
            type="password"
            :placeholder="isEdit ? '留空则不修改密码' : '输入密码'"
            :invalid="submitted && !isEdit && !form.password"
            fluid
          />
          <small
            v-if="submitted && !isEdit && !form.password"
            class="text-red-500"
            >密码不能为空</small
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >用户昵称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.nickName"
            placeholder="输入用户昵称"
            :invalid="submitted && !form.nickName"
            fluid
          />
          <small v-if="submitted && !form.nickName" class="text-red-500"
            >用户昵称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">手机号</label>
          <PrimeInputText
            v-model.trim="form.phone"
            placeholder="输入手机号"
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
          <label class="mb-2 block text-sm font-medium">性别</label>
          <PrimeSelect
            v-model="form.gender"
            :options="genderOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">所属部门</label>
          <DeptPicker v-model="form.deptId" placeholder="选择部门" />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">岗位</label>
          <PrimeSelect
            v-model="form.postId"
            :options="postOptions"
            option-label="label"
            option-value="value"
            placeholder="选择岗位"
            show-clear
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
        <label class="mb-2 block text-sm font-medium">角色</label>
        <PrimeMultiSelect
          v-model="form.roleIds"
          :options="roleOptions"
          option-label="label"
          option-value="value"
          placeholder="选择角色"
          display="chip"
          fluid
        />
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
