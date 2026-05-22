<script lang="ts" setup>
import ServerMonitorMgr from '@sakai/components/views/pages/ServerMonitorMgr.vue';
import { ServerMonitorMgrService } from '@sakai/services/ServerMonitorMgrService';
import { ServerMonitorService } from '@sakai/services/ServerMonitorService';

declareProviders([ServerMonitorService, ServerMonitorMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '服务监控' });
</script>

<template>
  <ServerMonitorMgr />
</template>
