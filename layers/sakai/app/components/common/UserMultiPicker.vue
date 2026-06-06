<script lang="ts" setup>
import type { SelectOption } from '@sakai/services/DeptService';
import { UserService } from '@sakai/services/UserService';

const props = withDefaults(
  defineProps<{
    modelValue: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: () => [],
    placeholder: '输入姓名搜索添加用户',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: SelectOption[]];
}>();

const userService = useService(UserService);
const suggestions = ref<SelectOption[]>([]);

const selected = computed({
  get: () => props.modelValue,
  set: (val) => {
    const unique = new Map<string, SelectOption>();
    for (const item of val) {
      unique.set(item.value, item);
    }
    emit('update:modelValue', [...unique.values()]);
  },
});

async function onSearch(event: { query: string }) {
  const q = event.query.trim();
  if (!q) {
    suggestions.value = [];
    return;
  }
  const results = await userService.searchUserOptions(q);
  const selectedIds = new Set(props.modelValue.map((u) => u.value));
  suggestions.value = results.filter((u) => !selectedIds.has(u.value));
}
</script>

<template>
  <PrimeAutoComplete
    v-model="selected"
    :suggestions="suggestions"
    option-label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    multiple
    force-selection
    fluid
    @complete="onSearch"
  />
</template>
