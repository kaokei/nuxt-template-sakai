import { authHandlers } from './auth';
import { backupHandlers } from './backups';
import { deptHandlers } from './depts';
import { dictHandlers } from './dict';
import { featureFlagHandlers } from './feature-flags';
import { jobsHandlers } from './jobs';
import { loginLogHandlers } from './login-logs';
import { menuHandlers } from './menus';
import { operLogHandlers } from './oper-logs';
import { postsHandlers } from './posts';
import { problemHandlers } from './problems';
import { roleHandlers } from './roles';
import { sysParamHandlers } from './sys-params';
import { userHandlers } from './users';

export const handlers = [
  ...problemHandlers,
  ...userHandlers,
  ...menuHandlers,
  ...deptHandlers,
  ...roleHandlers,
  ...dictHandlers,
  ...featureFlagHandlers,
  ...authHandlers,
  ...postsHandlers,
  ...sysParamHandlers,
  ...jobsHandlers,
  ...backupHandlers,
  ...loginLogHandlers,
  ...operLogHandlers,
];
