<script lang="ts" setup>
import OperLogMgr from '@sakai/components/views/pages/OperLogMgr.vue';
import { OperLogMgrService } from '@sakai/services/OperLogMgrService';
import { OperLogService } from '@sakai/services/OperLogService';

declareProviders([OperLogService, OperLogMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '操作日志' });
</script>

<template>
  <OperLogMgr />
</template>
