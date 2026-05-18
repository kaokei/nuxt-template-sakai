<script lang="ts" setup>
import OnlineUserMgr from '@sakai/components/views/pages/OnlineUserMgr.vue';
import { OnlineUserMgrService } from '@sakai/services/OnlineUserMgrService';
import { OnlineUserService } from '@sakai/services/OnlineUserService';

declareProviders([OnlineUserService, OnlineUserMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '在线用户' });
</script>

<template>
  <OnlineUserMgr />
</template>
