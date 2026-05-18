<script lang="ts" setup>
import LoginLogMgr from '@sakai/components/views/pages/LoginLogMgr.vue';
import { LoginLogMgrService } from '@sakai/services/LoginLogMgrService';
import { LoginLogService } from '@sakai/services/LoginLogService';

declareProviders([LoginLogService, LoginLogMgrService]);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '登录日志' });
</script>

<template>
  <LoginLogMgr />
</template>
