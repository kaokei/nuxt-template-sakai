<script lang="ts" setup>
import CacheMonitorMgr from '@sakai/components/views/pages/CacheMonitorMgr.vue';
import { CacheMonitorMgrService } from '@sakai/services/CacheMonitorMgrService';
import { CacheMonitorService } from '@sakai/services/CacheMonitorService';

declareProviders([CacheMonitorService, CacheMonitorMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '缓存监控' });
</script>

<template>
  <CacheMonitorMgr />
</template>
