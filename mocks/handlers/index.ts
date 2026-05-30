import { announcementHandlers } from './announcements';
import { areaCodeHandlers } from './area-codes';
import { assetHandlers } from './assets';
import { authHandlers } from './auth';
import { backupHandlers } from './backups';
import { bucketHandlers } from './buckets';
import { cacheListHandlers } from './cache-list';
import { cacheMonitorHandlers } from './cache-monitor';
import { certificateHandlers } from './certificate-templates';
import { dataMonitorHandlers } from './data-monitor';
import { deptHandlers } from './depts';
import { dictHandlers } from './dict';
import { featureFlagHandlers } from './feature-flags';
import { jobsHandlers } from './jobs';
import { loginLogHandlers } from './login-logs';
import { menuHandlers } from './menus';
import { miniappHandlers } from './miniapp';
import { notificationHandlers } from './notifications';
import { onlineUserHandlers } from './online-users';
import { operLogHandlers } from './oper-logs';
import { postsHandlers } from './posts';
import { problemHandlers } from './problems';
import { roleHandlers } from './roles';
import { sceneHandlers } from './scenes';
import { serverMonitorHandlers } from './server-monitor';
import { shortLinkHandlers } from './short-link';
import { sysParamHandlers } from './sys-params';
import { userHandlers } from './users';

export const handlers = [
  ...announcementHandlers,
  ...areaCodeHandlers,
  ...assetHandlers,
  ...authHandlers,
  ...backupHandlers,
  ...bucketHandlers,
  ...cacheListHandlers,
  ...cacheMonitorHandlers,
  ...certificateHandlers,
  ...dataMonitorHandlers,
  ...deptHandlers,
  ...dictHandlers,
  ...featureFlagHandlers,
  ...jobsHandlers,
  ...loginLogHandlers,
  ...menuHandlers,
  ...miniappHandlers,
  ...notificationHandlers,
  ...onlineUserHandlers,
  ...operLogHandlers,
  ...postsHandlers,
  ...problemHandlers,
  ...roleHandlers,
  ...sceneHandlers,
  ...serverMonitorHandlers,
  ...shortLinkHandlers,
  ...sysParamHandlers,
  ...userHandlers,
];
