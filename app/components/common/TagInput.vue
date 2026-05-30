<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    modelValue: string[];
    suggestions?: string[];
    placeholder?: string;
  }>(),
  {
    suggestions: () => [],
    placeholder: '输入标签，回车添加',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const inputValue = ref('');
const inputRef = ref<HTMLInputElement>();
const showSuggestions = ref(false);
const dropdownStyle = ref<Record<string, string>>({});

function updateDropdownPosition(): void {
  const el = inputRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  dropdownStyle.value = {
    position: 'fixed',
    top: rect.bottom + 4 + 'px',
    left: rect.left + 'px',
    width: rect.width + 'px',
    zIndex: '9999',
  };
}
const filteredSuggestions = computed(() => {
  if (!inputValue.value.trim()) return props.suggestions;
  const keyword = inputValue.value.trim().toLowerCase();
  return props.suggestions.filter(
    (s) => s.toLowerCase().includes(keyword) && !props.modelValue.includes(s),
  );
});

function addTag(tag: string): void {
  const trimmed = tag.trim();
  if (!trimmed || props.modelValue.includes(trimmed)) return;
  emit('update:modelValue', [...props.modelValue, trimmed]);
  inputValue.value = '';
}

function removeTag(index: number): void {
  const next = [...props.modelValue];
  next.splice(index, 1);
  emit('update:modelValue', next);
}

function onInputKeydown(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    event.preventDefault();
    if (inputValue.value.trim()) {
      addTag(inputValue.value);
    }
  } else if (event.key === 'Backspace' && !inputValue.value) {
    if (props.modelValue.length > 0) {
      removeTag(props.modelValue.length - 1);
    }
  }
}

function onBlur(): void {
  if (inputValue.value.trim()) {
    addTag(inputValue.value);
  }
  setTimeout(() => {
    showSuggestions.value = false;
  }, 150);
}
</script>

<template>
  <div class="relative">
    <div
      class="border-surface-300 bg-surface-0 flex flex-wrap items-center gap-1 rounded-md border px-3 py-1.5 transition-colors duration-200"
      :class="{
        'border-primary': showSuggestions,
      }"
    >
      <span
        v-for="(tag, index) in modelValue"
        :key="tag"
        class="bg-primary-50 text-primary-700 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      >
        {{ tag }}
        <button
          type="button"
          class="text-primary-500 hover:bg-primary-200 hover:text-primary-800 ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full"
          @click="removeTag(index)"
        >
          ×
        </button>
      </span>
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        class="placeholder:text-surface-400 min-w-[100px] flex-1 border-none bg-transparent py-0.5 text-sm outline-none"
        :placeholder="modelValue.length === 0 ? placeholder : ''"
        @focus="
          showSuggestions = true;
          updateDropdownPosition();
        "
        @keydown="onInputKeydown"
        @blur="onBlur"
      />
    </div>

    <!-- 自动补全下拉 -->
    <Teleport to="body">
      <ul
        v-if="showSuggestions && filteredSuggestions.length > 0"
        :style="dropdownStyle"
        class="border-surface-200 bg-surface-0 mt-1 max-h-48 overflow-auto rounded-md border shadow-lg"
      >
        <li
          v-for="suggestion in filteredSuggestions"
          :key="suggestion"
          class="hover:bg-surface-100 cursor-pointer px-3 py-2 text-sm"
          @mousedown.prevent="addTag(suggestion)"
        >
          {{ suggestion }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>
