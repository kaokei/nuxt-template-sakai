<script lang="ts" setup>
import { DeptService, type Dept } from '@sakai/services/DeptService';

interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
}

const props = withDefaults(
  defineProps<{
    modelValue: string | null;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: null,
    placeholder: '请选择部门',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const deptService = useService(DeptService);
const nodes = ref<TreeNode[]>([]);

const selected = computed({
  get: () => {
    // PrimeVue TreeSelect 需要 { key: true } 格式，将外部 string key 转换为对象格式
    if (props.modelValue) {
      return { [props.modelValue]: true };
    }
    return null;
  },
  set: (val) => {
    // PrimeVue TreeSelect emit { key: true } 格式，提取 string key 再 emit
    if (val === null || val === undefined) {
      emit('update:modelValue', null);
    } else if (typeof val === 'object' && !Array.isArray(val)) {
      const keys = Object.keys(val as Record<string, unknown>);
      emit('update:modelValue', keys.length > 0 ? (keys[0] as string) : null);
    } else {
      emit('update:modelValue', val as unknown as string | null);
    }
  },
});

function buildTree(depts: Dept[], parentId: string | null): TreeNode[] {
  return depts
    .filter((d) => d.parentId === parentId)
    .sort((a, b) => a.order - b.order)
    .map((d) => ({
      key: d.id,
      label: d.name,
      children: buildTree(depts, d.id),
    }));
}

onMounted(async () => {
  const depts = await deptService.queryDepts();
  nodes.value = buildTree(depts, null);
});
</script>

<template>
  <PrimeTreeSelect
    v-model="selected"
    :options="nodes"
    :placeholder="placeholder"
    :disabled="disabled"
    :selection-mode="'single'"
    show-clear
    fluid
  />
</template>
