<script lang="ts" setup>
import DataMonitorMgr from '@sakai/components/views/pages/DataMonitorMgr.vue';
import { DataMonitorMgrService } from '@sakai/services/DataMonitorMgrService';
import { DataMonitorService } from '@sakai/services/DataMonitorService';

declareProviders([DataMonitorService, DataMonitorMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '数据监控' });
</script>

<template>
  <DataMonitorMgr />
</template>
