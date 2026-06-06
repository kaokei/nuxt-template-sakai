<script lang="ts" setup>
import { DeptService, type Dept } from '@sakai/services/DeptService';

interface TreeNode {
  key: string;
  label: string;
  children?: TreeNode[];
}

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    placeholder: '请选择部门',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const deptService = useService(DeptService);
const nodes = ref<TreeNode[]>([]);

const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
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
    selection-mode="checkbox"
    display="chip"
    show-clear
    fluid
  />
</template>
