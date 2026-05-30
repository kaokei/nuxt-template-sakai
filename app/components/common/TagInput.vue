<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: string[];
    suggestions?: string[];
    placeholder?: string;
  }>(),
  {
    suggestions: () => [],
    placeholder: '选择或输入标签',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const inputValue = ref('');

const filteredOptions = computed(() => {
  const query = inputValue.value.trim().toLowerCase();
  const existing = new Set(props.modelValue);

  const matched = query
    ? props.suggestions.filter(
        (s) => s.toLowerCase().includes(query) && !existing.has(s),
      )
    : props.suggestions.filter((s) => !existing.has(s));

  // 如果输入了文字且未匹配到完全一致的已有标签，把输入本身也作为建议
  if (query && !props.suggestions.some((s) => s.toLowerCase() === query)) {
    matched.unshift(query);
  }

  return matched;
});

function onComplete(event: { query: string }): void {
  inputValue.value = event.query;
}
</script>

<template>
  <PrimeAutoComplete
    :model-value="modelValue"
    :suggestions="filteredOptions"
    :placeholder="placeholder"
    multiple
    type="text"
    class="w-full"
    @complete="onComplete"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
