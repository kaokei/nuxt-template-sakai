<script lang="ts" setup>
import ProblemMgr from '@sakai/components/views/pages/ProblemMgr.vue';
import { ProblemService } from '@sakai/services/ProblemService';

declareProviders([ProblemService]);

definePageMeta({
  layout: 'sakai',
});
</script>

<template>
  <ProblemMgr />
</template>
