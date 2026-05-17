<script lang="ts" setup>
import type { Post } from '~/types/post';
import { PostService } from '@sakai/services/PostService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Post | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const postService = useService(PostService);
const submitted = ref(false);

const form = ref({
  name: '',
  code: '',
  sort: 0,
  status: 'active' as Post['status'],
  remark: '',
});

const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '停用', value: 'inactive' },
];

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        name: editData.value.name,
        code: editData.value.code,
        sort: editData.value.sort,
        status: editData.value.status,
        remark: editData.value.remark || '',
      };
    } else {
      form.value = {
        name: '',
        code: '',
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
  if (!form.value.code.trim()) {
    return;
  }

  try {
    const payload: Record<string, any> = {
      name: form.value.name.trim(),
      code: form.value.code.trim(),
      sort: form.value.sort,
      status: form.value.status,
      remark: form.value.remark.trim() || undefined,
    };

    if (isEdit.value && editData.value) {
      await postService.update(editData.value.id, payload);
    } else {
      await postService.create(payload as Omit<Post, 'id' | 'createTime'>);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存岗位失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑岗位' : '新增岗位'"
    :modal="true"
    :style="{ width: '600px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >岗位名称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.name"
            placeholder="输入岗位名称"
            :invalid="submitted && !form.name"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.name" class="text-red-500"
            >岗位名称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium"
            >岗位编码 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.code"
            placeholder="输入岗位编码"
            :invalid="submitted && !form.code"
            :disabled="isEdit"
            fluid
          />
          <small v-if="submitted && !form.code" class="text-red-500"
            >岗位编码不能为空</small
          >
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">排序</label>
          <PrimeInputNumber
            v-model="form.sort"
            placeholder="输入排序号"
            :min="0"
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
