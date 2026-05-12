<script lang="ts" setup>
import type { Problem } from '@sakai/services/ProblemService';
import { ProblemService } from '@sakai/services/ProblemService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<Problem | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const problemService = useService(ProblemService);
const submitted = ref(false);

const form = ref({
  title: '',
  owner: '',
  difficulty: 'Easy' as Problem['difficulty'],
  tags: [] as string[],
  acceptanceRate: 50,
  submissions: 100,
  timeLimit: 1000,
  memoryLimit: 256,
  accessLevel: 'Public' as Problem['accessLevel'],
  description: '',
});

const allTags = ref<string[]>(problemService.getAllTags());
const difficultyOptions = ref(problemService.getDifficultyOptions());
const accessLevelOptions = ref(problemService.getAccessLevelOptions());
const ownerOptions = ref(problemService.getOwnerOptions());
const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = {
        title: editData.value.title,
        owner: editData.value.owner,
        difficulty: editData.value.difficulty,
        tags: [...editData.value.tags],
        acceptanceRate: editData.value.acceptanceRate,
        submissions: editData.value.submissions,
        timeLimit: editData.value.timeLimit,
        memoryLimit: editData.value.memoryLimit,
        accessLevel: editData.value.accessLevel,
        description: editData.value.description,
      };
    } else {
      form.value = {
        title: '',
        owner: '',
        difficulty: 'Easy',
        tags: [],
        acceptanceRate: 50,
        submissions: 100,
        timeLimit: 1000,
        memoryLimit: 256,
        accessLevel: 'Public',
        description: '',
      };
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (!form.value.title.trim()) {
    return;
  }

  try {
    if (isEdit.value && editData.value) {
      await problemService.updateProblem(editData.value.id, form.value);
    } else {
      await problemService.createProblem(form.value);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存题目失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑题目' : '新增题目'"
    :modal="true"
    :style="{ width: '700px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium"
            >题目名称 <span class="text-red-500">*</span></label
          >
          <PrimeInputText
            v-model.trim="form.title"
            placeholder="输入题目名称"
            :invalid="submitted && !form.title"
            fluid
            autofocus
          />
          <small v-if="submitted && !form.title" class="text-red-500"
            >题目名称不能为空</small
          >
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">题目所有者</label>
          <PrimeSelect
            v-model="form.owner"
            :options="ownerOptions"
            option-label="label"
            option-value="value"
            placeholder="选择所有者"
            fluid
          />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">难度</label>
          <PrimeSelect
            v-model="form.difficulty"
            :options="difficultyOptions"
            option-label="label"
            option-value="value"
            fluid
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">时间限制 (ms)</label>
          <PrimeInputNumber
            v-model="form.timeLimit"
            :min="100"
            :max="10000"
            :step="100"
            fluid
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">内存限制 (MB)</label>
          <PrimeInputNumber
            v-model="form.memoryLimit"
            :min="32"
            :max="4096"
            :step="32"
            fluid
          />
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">标签</label>
        <PrimeMultiSelect
          v-model="form.tags"
          :options="allTags"
          placeholder="选择标签"
          display="chip"
          fluid
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="mb-2 block text-sm font-medium">通过率 (%)</label>
          <PrimeInputNumber
            v-model="form.acceptanceRate"
            :min="0"
            :max="100"
            :step="0.1"
            :min-fraction-digits="1"
            :max-fraction-digits="1"
            fluid
            suffix=" %"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium">提交次数</label>
          <PrimeInputNumber
            v-model="form.submissions"
            :min="0"
            :step="1"
            fluid
          />
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">访问权限</label>
        <PrimeSelect
          v-model="form.accessLevel"
          :options="accessLevelOptions"
          option-label="label"
          option-value="value"
          fluid
        />
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">题目描述</label>
        <PrimeTextarea
          v-model="form.description"
          rows="3"
          placeholder="输入题目描述"
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
