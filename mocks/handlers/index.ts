import { deptHandlers } from './depts';
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
];
