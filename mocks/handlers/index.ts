import { deptHandlers } from './depts';
import { dictHandlers } from './dict';
import { featureFlagHandlers } from './feature-flags';
import { menuHandlers } from './menus';
import { problemHandlers } from './problems';
import { roleHandlers } from './roles';
import { userHandlers } from './users';

export const handlers = [
  ...problemHandlers,
  ...userHandlers,
  ...menuHandlers,
  ...deptHandlers,
  ...roleHandlers,
  ...dictHandlers,
  ...featureFlagHandlers,
];
