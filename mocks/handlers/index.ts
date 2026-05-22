import { announcementHandlers } from './announcements';
import { authHandlers } from './auth';
import { backupHandlers } from './backups';
import { cacheListHandlers } from './cache-list';
import { cacheMonitorHandlers } from './cache-monitor';
import { dataMonitorHandlers } from './data-monitor';
import { deptHandlers } from './depts';
import { dictHandlers } from './dict';
import { featureFlagHandlers } from './feature-flags';
import { jobsHandlers } from './jobs';
import { loginLogHandlers } from './login-logs';
import { menuHandlers } from './menus';
import { notificationHandlers } from './notifications';
import { onlineUserHandlers } from './online-users';
import { operLogHandlers } from './oper-logs';
import { postsHandlers } from './posts';
import { problemHandlers } from './problems';
import { roleHandlers } from './roles';
import { serverMonitorHandlers } from './server-monitor';
import { sysParamHandlers } from './sys-params';
import { userHandlers } from './users';

export const handlers = [
  ...announcementHandlers,
  ...authHandlers,
  ...backupHandlers,
  ...cacheListHandlers,
  ...cacheMonitorHandlers,
  ...dataMonitorHandlers,
  ...deptHandlers,
  ...dictHandlers,
  ...featureFlagHandlers,
  ...jobsHandlers,
  ...loginLogHandlers,
  ...menuHandlers,
  ...notificationHandlers,
  ...onlineUserHandlers,
  ...operLogHandlers,
  ...postsHandlers,
  ...problemHandlers,
  ...roleHandlers,
  ...serverMonitorHandlers,
  ...sysParamHandlers,
  ...userHandlers,
];
