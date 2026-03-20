<script lang="ts" setup>
import { useSeoMeta } from '#imports';
import iconBlankSvg from '@/assets/icons/icon-blank.svg';

useSeoMeta({
  title: 'kaokei',
});
</script>

<template>
  <div class="ps-6 pt-10">
    <h1>测试页面</h1>
    <div>
      <img :src="iconBlankSvg" alt="测试图片" class="w-28" />
    </div>

    <div>
      <NuxtIcon name="uil:clipboard" class="me-2" />
      <NuxtIcon name="local:icon-blank" class="me-2" />
    </div>
  </div>
</template>
