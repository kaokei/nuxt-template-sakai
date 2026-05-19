<script setup>
import AppFooter from '@sakai/components/layout/AppFooter.vue';
import AppTopbarConsumer from '@sakai/components/layout/AppTopbarConsumer.vue';
</script>

<template>
  <div class="layout-wrapper layout-consumer">
    <AppTopbarConsumer />
    <div class="layout-main-container">
      <div class="layout-main layout-main-centered">
        <slot></slot>
      </div>
      <AppFooter />
    </div>
  </div>
  <PrimeToast />
</template>
