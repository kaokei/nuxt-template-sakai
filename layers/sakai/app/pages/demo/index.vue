<script lang="ts" setup>
// /demo 重定向到工作台首页
definePageMeta({
  layout: 'sakai-sidebar',
});
useSeoMeta({ title: '演示' });

const router = useRouter();
onMounted(() => {
  router.replace('/demo/workbench/workplace');
});
</script>

<template>
  <div class="flex min-h-[60vh] items-center justify-center">
    <PrimeProgressSpinner />
  </div>
</template>
