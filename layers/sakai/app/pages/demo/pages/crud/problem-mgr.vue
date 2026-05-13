<script lang="ts" setup>
import ProblemMgr from '@sakai/components/views/pages/ProblemMgr.vue';
import { ProblemMgrService } from '@sakai/services/ProblemMgrService';
import { ProblemService } from '@sakai/services/ProblemService';

declareProviders([ProblemService, ProblemMgrService]);

definePageMeta({
  layout: 'sakai',
});
</script>

<template>
  <ProblemMgr />
</template>
