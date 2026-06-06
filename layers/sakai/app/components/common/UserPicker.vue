<script lang="ts" setup>
import type { SelectOption } from '@sakai/services/DeptService';
import { UserService } from '@sakai/services/UserService';

const props = withDefaults(
  defineProps<{
    modelValue: SelectOption | null;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: null,
    placeholder: '输入姓名搜索',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: SelectOption | null];
}>();

const userService = useService(UserService);
const suggestions = ref<SelectOption[]>([]);

const selected = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

async function onSearch(event: { query: string }) {
  if (!event.query.trim()) {
    suggestions.value = [];
    return;
  }
  suggestions.value = await userService.searchUserOptions(event.query);
}
</script>

<template>
  <PrimeAutoComplete
    v-model="selected"
    :suggestions="suggestions"
    option-label="label"
    :placeholder="placeholder"
    :disabled="disabled"
    force-selection
    fluid
    @complete="onSearch"
  />
</template>
