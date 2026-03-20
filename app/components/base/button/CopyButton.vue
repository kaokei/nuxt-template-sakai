<script lang="ts" setup>
import copy from 'copy-to-clipboard';

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
});

const tooltip1 = '点击复制';
const tooltip2 = '已复制！';
const copyTooltip = ref(tooltip1);
const copied = ref(false);
const handleCopy = () => {
  if (!props.text) {
    return;
  }
  copy(props.text);
  copied.value = true;
  copyTooltip.value = tooltip2;
  setTimeout(() => {
    copied.value = false;
    copyTooltip.value = tooltip1;
  }, 2500);
};

const icon = computed(() => {
  return copied.value ? 'i-lucide:copy-check' : 'i-lucide:copy';
});
const color = computed(() => {
  return copied.value ? 'primary' : 'neutral';
});

const tooltipOptions = computed(() => ({



   value: copyTooltip.value, showDelay: 1000, hideDelay: 300
}));
</script>

<template>

    <PrimeButton
    v-tooltip.left="tooltipOptions"
      :icon="icon"
      :color="color"
      size="xl"
      variant="subtle"
      @click="handleCopy"
    />

</template>
