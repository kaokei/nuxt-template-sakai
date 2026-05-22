<script lang="ts" setup>
import CacheListMgr from '@sakai/components/views/pages/CacheListMgr.vue';
import { CacheListMgrService } from '@sakai/services/CacheListMgrService';
import { CacheListService } from '@sakai/services/CacheListService';

declareProviders([CacheListService, CacheListMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '缓存列表' });
</script>

<template>
  <CacheListMgr />
</template>
