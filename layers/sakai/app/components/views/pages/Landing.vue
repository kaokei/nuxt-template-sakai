<script setup lang="ts">
import FeaturesWidget from '@sakai/components/landing/FeaturesWidget.vue';
import FooterWidget from '@sakai/components/landing/FooterWidget.vue';
import HeroWidget from '@sakai/components/landing/HeroWidget.vue';
import HighlightsWidget from '@sakai/components/landing/HighlightsWidget.vue';
import PricingWidget from '@sakai/components/landing/PricingWidget.vue';
import TopbarWidget from '@sakai/components/landing/TopbarWidget.vue';
</script>

<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper overflow-hidden">
      <div
        class="relative mx-0 flex items-center justify-between px-6 py-6 md:mx-12 lg:static lg:mx-20 lg:px-20"
      >
        <TopbarWidget />
      </div>
      <HeroWidget />
      <FeaturesWidget />
      <HighlightsWidget />
      <PricingWidget />
      <FooterWidget />
    </div>
  </div>
</template>
