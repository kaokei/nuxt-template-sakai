<script lang="ts" setup>
import { useSeoMeta } from '#imports';

useSeoMeta({
  title: 'kaokei',
});
</script>

<template>
  <div class="container mx-auto ps-6 pt-10">
    <h1 class="text-3xl font-bold">Nuxt模版项目</h1>
    <p>PrimeVue@v4 + Nuxt@v4 + tailwindcss@v4</p>
    <p>
      基于primevue sakai主题的二次开发，将原项目移植成为nuxt
      layer，从而方便复用代码。
    </p>

    <div class="flex gap-2">
      <PrimeButton
        label="查看源代码"
        as="a"
        target="_blank"
        rel="noopener"
        severity="info"
        href="https://github.com/kaokei/nuxt-template-sakai"
      />
      <PrimeButton label="查看demo" as="router-link" to="/demo/" />
    </div>
  </div>
</template>
