<script lang="ts" setup>
import ProblemMgr from '@sakai/components/views/pages/ProblemMgr.vue';
import { ProblemMgrService } from '@sakai/services/ProblemMgrService';
import { ProblemService } from '@sakai/services/ProblemService';
import { ProblemMockService } from '@sakai/services/mock/problem-mock.service';

declareProviders([ProblemMockService, ProblemService, ProblemMgrService]);

definePageMeta({
  layout: 'sakai',
});
</script>

<template>
  <ProblemMgr />
</template>
