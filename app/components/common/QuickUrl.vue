<script lang="ts" setup>
interface Props {
  prefix: string;
}
const props = defineProps<Props>();

const fullUrl = computed(() => `${props.prefix}.kaokei.com`);
const fullHref = computed(() => `https://${props.prefix}.kaokei.com`);
</script>

<template>
  <NuxtLink
    class="font-rubik group text-2xl hover:underline"
    :to="fullHref"
    target="_blank"
  >
    <span>{{ fullUrl }}</span>
    <NuxtIcon
      name="i-lucide:arrow-up-right"
      class="invisible size-4 transition-transform duration-200 ease-in-out group-hover:visible group-hover:translate-x-1"
    />
  </NuxtLink>
</template>
