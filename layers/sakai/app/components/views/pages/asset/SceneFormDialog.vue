<script lang="ts" setup>
import type { Bucket, Scene } from '@sakai/types/asset';
import { SceneService } from '@sakai/services/SceneService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Scene | null>('editData', { default: null });
const emit = defineEmits<{ saved: [] }>();

const service = useService(SceneService);
const submitted = ref(false);
const buckets = ref<Bucket[]>([]);

const form = ref({
  name: '',
  bucketId: '',
  description: '',
});

const isEdit = computed(() => !!editData.value);

async function loadBuckets(): Promise<void> {
  try {
    buckets.value = await service.getBuckets();
  } catch {
    buckets.value = [];
  }
}

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    loadBuckets();
    if (editData.value) {
      form.value = {
        name: editData.value.name,
        bucketId: editData.value.bucketId,
        description: editData.value.description || '',
      };
    } else {
      form.value = {
        name: '',
        bucketId: '',
        description: '',
      };
    }
  }
});

async function handleSave(): Promise<void> {
  submitted.value = true;
  if (!form.value.name.trim()) return;
  if (!isEdit.value && !form.value.bucketId) return;

  if (isEdit.value && editData.value) {
    await service.update(editData.value.id, {
      name: form.value.name.trim(),
      description: form.value.description.trim() || undefined,
    });
  } else {
    await service.create({
      name: form.value.name.trim(),
      bucketId: form.value.bucketId,
      description: form.value.description.trim() || undefined,
    });
  }
  emit('saved');
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑场景' : '新建场景'"
    :modal="true"
    :style="{ width: '520px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">
          场景名称 <span class="text-red-500">*</span>
        </label>
        <PrimeInputText
          v-model="form.name"
          :class="{ 'p-invalid': submitted && !form.name.trim() }"
          placeholder="如：App发布、活动素材"
          class="w-full"
        />
        <small v-if="submitted && !form.name.trim()" class="text-red-500"
          >请输入场景名称</small
        >
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">
          存储桶 <span v-if="!isEdit" class="text-red-500">*</span>
        </label>
        <PrimeSelect
          v-if="!isEdit"
          v-model="form.bucketId"
          :options="buckets"
          option-label="name"
          option-value="id"
          :class="{ 'p-invalid': submitted && !form.bucketId }"
          placeholder="请选择存储桶"
          class="w-full"
        />
        <PrimeInputText
          v-else
          :value="
            buckets.find((b) => b.id === editData?.bucketId)?.name ??
            editData?.bucketId
          "
          disabled
          class="w-full"
        />
        <small
          v-if="submitted && !isEdit && !form.bucketId"
          class="text-red-500"
          >请选择存储桶</small
        >
      </div>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">描述</label>
        <PrimeTextarea
          v-model="form.description"
          rows="3"
          placeholder="可选，描述该场景的用途"
          class="w-full"
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton label="保存" @click="handleSave" />
    </template>
  </PrimeDialog>
</template>
